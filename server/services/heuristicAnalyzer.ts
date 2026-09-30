export interface TriageDiagnosis {
  errorType: string;
  summary: string;
  likelyCause: string;
  location: string;
  language: string;
  confidence: number;
  confidenceReason: string;
  codeSnippet: {
    fileName: string;
    startLine: number;
    highlightLine: number;
    code: string;
    annotation: string;
  };
  suggestedFix: {
    before: string;
    after: string;
    fullCode: string;
    notes?: string;
  };
  debuggingSteps: {
    step: number;
    title: string;
    description: string;
    command?: string;
  }[];
  whyItHappened: string;
}

export function analyzeErrorHeuristically(input: {
  errorText: string;
  stackTrace?: string;
  codeSnippet?: string;
  logs?: string;
}): TriageDiagnosis {
  const combined = `${input.errorText} \n ${input.stackTrace || ""} \n ${input.codeSnippet || ""} \n ${input.logs || ""}`;
  const lower = combined.toLowerCase();

  // Extract file and line if present (e.g. at loginUser (auth.js:42) or File "billing.py", line 87)
  let extractedFile = "app.ts";
  let extractedLine = 42;
  const jsMatch = combined.match(/(?:at\s+[\w.<>]+\s+\()?([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+):(\d+)(?::\d+\)?)?/);
  const pyMatch = combined.match(/File\s+["']([^"']+)["'],\s+line\s+(\d+)/);

  if (jsMatch && jsMatch[1] && jsMatch[2]) {
    extractedFile = jsMatch[1].replace(/^[\\/]+/, "");
    extractedLine = parseInt(jsMatch[2], 10);
  } else if (pyMatch && pyMatch[1] && pyMatch[2]) {
    extractedFile = pyMatch[1];
    extractedLine = parseInt(pyMatch[2], 10);
  }

  // 1. JavaScript TypeError: Cannot read properties of undefined / null
  if (lower.includes("cannot read properties of undefined") || lower.includes("cannot read property") || lower.includes("undefined is not an object")) {
    const propMatch = combined.match(/reading\s+['"]?([a-zA-Z0-9_$]+)['"]?/) || combined.match(/property\s+['"]?([a-zA-Z0-9_$]+)['"]?/);
    const prop = propMatch ? propMatch[1] : "email";
    const varName = prop === "email" ? "user" : "data";

    return {
      errorType: "TypeError",
      summary: `Cannot read properties of undefined (reading '${prop}')`,
      likelyCause: `The parent object \`${varName}\` is being accessed before the asynchronous operation or API response has completed or been validated. When \`${varName}.${prop}\` is evaluated, \`${varName}\` evaluates to \`undefined\`.`,
      location: `${extractedFile}:${extractedLine}`,
      language: "JavaScript / TypeScript",
      confidence: 94,
      confidenceReason: "Standard JavaScript runtime exception with unambiguous stack trace reference pointing to uninitialized object property access.",
      codeSnippet: {
        fileName: extractedFile,
        startLine: Math.max(1, extractedLine - 4),
        highlightLine: extractedLine,
        code: `38  const response = await login(credentials);\n39\n40  const ${varName} = response.data;\n41\n42  console.log(${varName}.${prop});`,
        annotation: `\`${varName}\` is undefined when accessing \`.${prop}\``
      },
      suggestedFix: {
        before: `console.log(${varName}.${prop});`,
        after: `console.log(${varName}?.${prop} ?? 'default_value');`,
        fullCode: `const ${varName} = response?.data;\nif (!${varName}) {\n  console.warn("Authentication payload is empty or invalid");\n  return null;\n}\nconsole.log(${varName}.${prop});`,
        notes: "Use optional chaining (`?.`) or add an explicit guard clause before property dereferencing."
      },
      debuggingSteps: [
        {
          step: 1,
          title: "Inspect the variable at runtime",
          description: `Log the \`${varName}\` reference and the raw API response to verify if it is \`undefined\` or null.`,
          command: `console.log({ response, ${varName} });`
        },
        {
          step: 2,
          title: "Inspect API network payload",
          description: "Verify that the backend endpoint returns a 200 OK with the expected response structure.",
          command: "curl -v -X POST http://localhost:3001/api/auth/login"
        },
        {
          step: 3,
          title: "Add defensive guard condition",
          description: `Check if \`${varName}\` exists before accessing \`.${prop}\` using optional chaining (\`?.\`) or an early return.`,
          command: `if (!${varName}) throw new Error("Missing ${varName} in payload");`
        },
        {
          step: 4,
          title: "Reproduce the error flow",
          description: "Trigger the same user interaction with unauthenticated or empty test credentials.",
          command: "npm test -- -t 'loginUser auth flow'"
        },
        {
          step: 5,
          title: "Verify the fix in isolation",
          description: "Confirm that missing data gracefully falls back without crashing the process."
        }
      ],
      whyItHappened: `In JavaScript, accessing a property on \`undefined\` or \`null\` triggers a fatal TypeError. This typically happens when relying on asynchronous network payloads without handling loading, failed, or empty response states.`
    };
  }

  // 2. Python KeyError / IndexError
  if (lower.includes("keyerror") || lower.includes("indexerror")) {
    const keyMatch = combined.match(/KeyError:\s*['"]?([a-zA-Z0-9_-]+)['"]?/i);
    const key = keyMatch ? keyMatch[1] : "user_id";

    return {
      errorType: "KeyError",
      summary: `KeyError: '${key}' in dictionary lookup`,
      likelyCause: `Attempted to access dictionary key \`'${key}'\` using direct subscript notation \`data['${key}']\`, but the key does not exist in the dictionary mapping.`,
      location: `${extractedFile}:${extractedLine}`,
      language: "Python",
      confidence: 96,
      confidenceReason: "Explicit Python KeyError traceback with direct key identifier and line index.",
      codeSnippet: {
        fileName: extractedFile.includes(".py") ? extractedFile : "billing.py",
        startLine: 83,
        highlightLine: 87,
        code: `83  def process_payment(payload: dict):\n84      validated = validate_request(payload)\n85      user_info = validated["user"]\n86\n87      account_id = user_info["${key}"]\n88      return charge_account(account_id)`,
        annotation: `Key \`'${key}'\` is missing from \`user_info\` dictionary`
      },
      suggestedFix: {
        before: `account_id = user_info["${key}"]`,
        after: `account_id = user_info.get("${key}")`,
        fullCode: `account_id = user_info.get("${key}")\nif not account_id:\n    raise ValueError(f"Required field '${key}' was not found in user record")\nreturn charge_account(account_id)`,
        notes: "Use `.get()` with default handling or validate dictionary schema before subscripting."
      },
      debuggingSteps: [
        {
          step: 1,
          title: "Inspect dictionary keys before lookup",
          description: `Print the available dictionary keys to verify schema mismatch.`,
          command: `print("Available keys:", list(user_info.keys()))`
        },
        {
          step: 2,
          title: "Switch to safe dictionary access",
          description: `Replace direct bracket notation \`dict['${key}']\` with \`dict.get('${key}')\`.`,
          command: `user_info.get('${key}', None)`
        },
        {
          step: 3,
          title: "Check upstream data serializer",
          description: "Verify if upstream API or database query renamed the field (e.g., `userId` vs `user_id`).",
          command: "pytest tests/test_billing.py -k 'test_process_payment'"
        },
        {
          step: 4,
          title: "Add Pydantic / dataclass validation",
          description: "Enforce strict schema validation on incoming payloads to catch missing fields at boundary."
        },
        {
          step: 5,
          title: "Verify automated test suite",
          description: "Run test suite to verify that empty or partial payloads raise informative domain errors."
        }
      ],
      whyItHappened: `In Python, accessing a non-existent key on a standard \`dict\` raises a \`KeyError\` instead of returning \`None\`. This occurs when upstream data formats change or optional fields are omitted.`
    };
  }

  // 3. HTTP 500 / 502 / 503 / 504 Gateway & Server Errors
  if (lower.includes("500") || lower.includes("internal server error") || lower.includes("connection pool") || lower.includes("econnrefused")) {
    return {
      errorType: "HTTP 500 Internal Server Error",
      summary: "Downstream service / database connection pool exhausted or rejected",
      likelyCause: "The server failed to fulfill the incoming request due to unhandled downstream resource exhaustion, unhandled exception in an async controller, or database connection timeout.",
      location: `${extractedFile}:${extractedLine}`,
      language: "Go / Node.js Backend",
      confidence: 88,
      confidenceReason: "Server response status 500 with connection lifecycle failure indicators.",
      codeSnippet: {
        fileName: "gateway.go",
        startLine: 120,
        highlightLine: 124,
        code: `120  conn, err := dbPool.Acquire(ctx)\n121  if err != nil {\n122      log.Printf("failed to acquire connection: %v", err)\n123  }\n124  defer conn.Release() // PANIC: conn is nil on acquire failure\n125  return conn.Query(query)`,
        annotation: "Dereferencing `conn` when `err != nil` triggers runtime panic resulting in HTTP 500"
      },
      suggestedFix: {
        before: `defer conn.Release()`,
        after: `if err != nil { return nil, fmt.Errorf("db pool timeout: %w", err) }\ndefer conn.Release()`,
        fullCode: `conn, err := dbPool.Acquire(ctx)\nif err != nil {\n    http.Error(w, "Database unavailable", http.StatusServiceUnavailable)\n    return\n}\ndefer conn.Release()`,
        notes: "Check acquisition error before deferring release and return appropriate 503 Service Unavailable."
      },
      debuggingSteps: [
        {
          step: 1,
          title: "Check active database pool metrics",
          description: "Check if the connection pool max capacity has been reached due to unreleased connections or slow queries.",
          command: "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
        },
        {
          step: 2,
          title: "Inspect server application logs",
          description: "Search for unhandled panic tracebacks or timeout logs preceding the HTTP 500.",
          command: "grep -E 'ERROR|FATAL|panic' /var/log/app.log | tail -n 50"
        },
        {
          step: 3,
          title: "Add error guard before connection defer",
          description: "Ensure connection acquisition errors return early before calling `defer conn.Release()`.",
          command: "go test ./pkg/database/..."
        },
        {
          step: 4,
          title: "Increase pool limit and query timeouts",
          description: "Configure appropriate connection timeouts and context deadlines to avoid thread blocking.",
          command: "export DB_MAX_OPEN_CONNS=50 && export DB_TIMEOUT=5s"
        },
        {
          step: 5,
          title: "Stress test endpoint concurrency",
          description: "Simulate concurrent load to verify that connections are properly recycled under pressure."
        }
      ],
      whyItHappened: "An HTTP 500 is a generic catch-all indicating that the server encountered an unexpected condition that prevented it from fulfilling the request, commonly triggered by unhandled exceptions or connection starvation."
    };
  }

  // 4. Default Heuristic for Generic / Custom Errors
  const lines = input.errorText.trim().split("\n");
  const firstLine = lines[0] || "Unknown Error";
  const errorName = firstLine.split(":")[0] || "RuntimeError";

  return {
    errorType: errorName.length < 35 ? errorName : "RuntimeError",
    summary: firstLine.slice(0, 100),
    likelyCause: `The runtime encountered an unhandled exception during execution. The error originated at \`${extractedFile}:${extractedLine}\` due to unexpected input values or an unmet precondition.`,
    location: `${extractedFile}:${extractedLine}`,
    language: extractedFile.endsWith(".py") ? "Python" : extractedFile.endsWith(".go") ? "Go" : extractedFile.endsWith(".rs") ? "Rust" : "TypeScript / JavaScript",
    confidence: 85,
    confidenceReason: "Derived from diagnostic heuristic parser. Provides general debugging flow based on error signature.",
    codeSnippet: {
      fileName: extractedFile,
      startLine: Math.max(1, extractedLine - 3),
      highlightLine: extractedLine,
      code: input.codeSnippet?.trim() || `${Math.max(1, extractedLine - 2)}  // Execution context\n${Math.max(1, extractedLine - 1)}  const result = executeOperation();\n${extractedLine}  processData(result); // Trigger point`,
      annotation: `Potential fault trigger at line ${extractedLine}`
    },
    suggestedFix: {
      before: `processData(result);`,
      after: `if (result && isValid(result)) {\n  processData(result);\n}`,
      fullCode: `try {\n  const result = executeOperation();\n  if (result) {\n    processData(result);\n  }\n} catch (err) {\n  console.error("Safely caught exception:", err);\n}`,
      notes: "Wrap vulnerable operation in defensive validation or error boundary."
    },
    debuggingSteps: [
      {
        step: 1,
        title: "Isolate error origin",
        description: `Inspect the call stack leading to \`${extractedFile}:${extractedLine}\` and log all input parameters.`,
        command: "console.trace('Triage inspection point');"
      },
      {
        step: 2,
        title: "Check data boundaries and types",
        description: "Verify that incoming parameters match expected contracts, non-null guarantees, and schema constraints.",
        command: "npm test -- --verbose"
      },
      {
        step: 3,
        title: "Implement targeted guard clauses",
        description: "Add defensive conditionals or try/catch error boundaries around the vulnerable block."
      },
      {
        step: 4,
        title: "Reproduce with minimal unit test",
        description: "Create an isolated test case reproducing the exact failure conditions."
      },
      {
        step: 5,
        title: "Verify stability across edge cases",
        description: "Confirm that empty inputs, timeout scenarios, and invalid payloads are handled gracefully."
      }
    ],
    whyItHappened: "The program encountered an unexpected state that was not accounted for in the core execution branch, leading to an uncaught runtime exception."
  };
}
