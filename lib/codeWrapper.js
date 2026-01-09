
// // Helper to find function name
// function findFunctionName(code, lang) {
//     if (lang === 'JAVASCRIPT') {
//         const match = code.match(/var\s+(\w+)\s*=\s*function/);
//         if (match) return match[1];
//         const matchFn = code.match(/function\s+(\w+)\s*\(/);
//         if (matchFn) return matchFn[1];
//     } else if (lang === 'PYTHON') {
//         const match = code.match(/def\s+(\w+)\(/);
//         if (match) return match[1];
//     } else if (lang === 'JAVA') {
//         const match = code.match(/public\s+[\w<>]+\s+(\w+)\(/);
//         if (match) return match[1];
//     }
//     return 'solution';
// }

// export function detectProblemType(snippet) {
//     if (snippet.includes('@param {number}')) return 'NUMBER';
//     if (snippet.includes('@param {string}')) return 'STRING';
//     return 'STRING'; // Default
// }

// // Generic Wrapper Generator
// export function generateWrapper(language, code, problemType) {
//     const fnName = findFunctionName(code, language);

//     // JS
//     if (language === 'JAVASCRIPT') {
//         return `
// const fs = require("fs");
// const rawInput = fs.readFileSync(0, "utf8").trim();
// let input = rawInput;
// if (input.includes('=')) input = input.split('=').pop().trim();

// let parsedInput;
// try {
//     parsedInput = JSON.parse(input);
// } catch(e) {
//     parsedInput = input;
// }

// if ("${problemType}" === "NUMBER" && typeof parsedInput !== "number" && !Array.isArray(parsedInput)) {
//     parsedInput = Number(input);
// }

// ${code}

// const result = ${fnName}(parsedInput);
// if (typeof result === 'object') {
//     console.log(JSON.stringify(result));
// } else {
//     console.log(result);
// }
// `;
//     }

//     // PYTHON
//     if (language === 'PYTHON') {
//         return `
// import sys
// import json

// raw_input = sys.stdin.read().strip()
// if '=' in raw_input:
//     raw_input = raw_input.split('=')[-1].strip()

// try:
//     input_val = json.loads(raw_input)
// except:
//     # Handle single string inputs or unparsable JSON
//     input_val = raw_input.strip('"\\'').strip("'")

// ${code}

// def run_solution():
//     if 'Solution' in globals():
//         sol = Solution()
//         if hasattr(sol, "${fnName}"):
//             return getattr(sol, "${fnName}")(input_val)
    
//     if "${fnName}" in globals():
//         return globals()["${fnName}"](input_val)
    
//     # Fallback to any detected function if names mismatch
//     for name, obj in globals().items():
//         if callable(obj) and not name.startswith("__") and name != 'run_solution':
//              return obj(input_val)
    
//     return None

// result = run_solution()
// if isinstance(result, (list, dict)):
//     print(json.dumps(result))
// else:
//     print(result)
// `;
//     }

//     // JAVA
//     if (language === 'JAVA') {
//         let sanitizedCode = code.replace(/public\s+class\s+/g, 'class ');
//         return `
// import java.util.*;
// import java.io.*;
// import java.util.stream.*;
// import java.lang.reflect.*;

// public class Main {
//     public static void main(String[] args) throws Exception {
//         Scanner scanner = new Scanner(System.in);
//         StringBuilder sb = new StringBuilder();
//         while(scanner.hasNextLine()) {
//             sb.append(scanner.nextLine());
//         }
//         String input = sb.toString().trim();
        
//         if (!input.isEmpty()) {
//             if (input.contains("=")) input = input.split("=")[1].trim();
            
//             Solution solInstance = new Solution();
//             Method targetMethod = null;
            
//             for (Method m : Solution.class.getDeclaredMethods()) {
//                 if (m.getName().equals("${fnName}") || (Modifier.isPublic(m.getModifiers()) && !m.getName().equals("main"))) {
//                     targetMethod = m;
//                     break;
//                 }
//             }

//             if (targetMethod != null) {
//                 Object parsedInput = parseInput(input, targetMethod.getParameterTypes()[0]);
//                 Object result = targetMethod.invoke(solInstance, parsedInput);
//                 printResult(result);
//             }
//         }
//         scanner.close();
//     }

//     private static Object parseInput(String input, Class<?> type) {
//         input = input.trim();
//         if (type == int.class || type == Integer.class) return Integer.parseInt(input);
//         if (type == String.class) return input.replace("\\"", "").replace("\\'", "");
//         if (type == int[].class || type == Integer[].class) {
//             String content = input.substring(1, input.length() - 1).trim();
//             if (content.isEmpty()) return new int[0];
//             return Arrays.stream(content.split(","))
//                          .map(String::trim)
//                          .mapToInt(Integer::parseInt)
//                          .toArray();
//         }
//         return input;
//     }

//     private static void printResult(Object res) {
//         if (res instanceof int[]) {
//             System.out.println(Arrays.toString((int[])res).replace(" ", ""));
//         } else if (res instanceof List) {
//             System.out.println(res.toString().replace(" ", ""));
//         } else {
//             System.out.println(res);
//         }
//     }
// }

// ${sanitizedCode}
// `;
//     }

//     return code;
// }

// Helper to find function name
function findFunctionName(code, lang) {
    if (lang === 'JAVASCRIPT') {
        const match = code.match(/var\s+(\w+)\s*=\s*function/);
        if (match) return match[1];
        const matchFn = code.match(/function\s+(\w+)\s*\(/);
        if (matchFn) return matchFn[1];
    } else if (lang === 'PYTHON') {
        const match = code.match(/def\s+(\w+)\(/);
        if (match) return match[1];
    } else if (lang === 'JAVA') {
        const match = code.match(/public\s+[\w<>]+\s+(\w+)\(/);
        if (match) return match[1];
    }
    return 'solution';
}

// Helper to count function parameters
function countFunctionParams(code, lang) {
    if (lang === 'JAVASCRIPT') {
        const match = code.match(/function\s+\w+\s*\(([^)]*)\)/) || 
                      code.match(/var\s+\w+\s*=\s*function\s*\(([^)]*)\)/);
        if (match && match[1]) {
            const params = match[1].split(',').filter(p => p.trim());
            return params.length;
        }
    } else if (lang === 'PYTHON') {
        const match = code.match(/def\s+\w+\s*\(([^)]*)\)/);
        if (match && match[1]) {
            const params = match[1].split(',')
                .filter(p => p.trim() && p.trim() !== 'self');
            return params.length;
        }
    } else if (lang === 'JAVA') {
        const match = code.match(/public\s+[\w<>]+\s+\w+\s*\(([^)]*)\)/);
        if (match && match[1]) {
            const params = match[1].split(',').filter(p => p.trim());
            return params.length;
        }
    }
    return 1; // Default to single parameter
}

export function detectProblemType(snippet) {
    if (snippet.includes('@param {number}')) return 'NUMBER';
    if (snippet.includes('@param {string}')) return 'STRING';
    return 'STRING'; // Default
}

// Generic Wrapper Generator
export function generateWrapper(language, code, problemType) {
    const fnName = findFunctionName(code, language);
    const paramCount = countFunctionParams(code, language);

    // JS
    if (language === 'JAVASCRIPT') {
        return `
const fs = require("fs");
const rawInput = fs.readFileSync(0, "utf8").trim();

function parseInput(input) {
    // Remove variable assignment if present (e.g., "arr = [1,2,3]")
    if (input.includes('=')) {
        input = input.split('=').pop().trim();
    }
    
    // Try to parse as JSON first
    try {
        return JSON.parse(input);
    } catch(e) {
        // If it's a plain number, parse it
        if (!isNaN(input)) {
            return Number(input);
        }
        // Otherwise return as string
        return input.replace(/^["']|["']$/g, '');
    }
}

// Handle multi-line inputs for multi-parameter functions
const lines = rawInput.split('\\n').map(line => line.trim()).filter(line => line);
let parsedArgs;

if (${paramCount} === 1) {
    // Single parameter - join all lines if multiple exist
    parsedArgs = [parseInput(lines.join('\\n'))];
} else {
    // Multiple parameters - parse each line as a separate argument
    parsedArgs = lines.slice(0, ${paramCount}).map(parseInput);
}

${code}

const result = ${fnName}(...parsedArgs);
if (typeof result === 'object') {
    console.log(JSON.stringify(result));
} else {
    console.log(result);
}
`;
    }

    // PYTHON
    if (language === 'PYTHON') {
        return `
import sys
import json

raw_input = sys.stdin.read().strip()

def parse_input(input_str):
    """Parse a single input line"""
    if '=' in input_str:
        input_str = input_str.split('=')[-1].strip()
    
    try:
        return json.loads(input_str)
    except:
        # Try as number
        try:
            return int(input_str) if '.' not in input_str else float(input_str)
        except:
            # Return as string, removing quotes
            return input_str.strip('"\\'')

# Handle multi-line inputs
lines = [line.strip() for line in raw_input.split('\\n') if line.strip()]

if ${paramCount} == 1:
    # Single parameter
    input_val = parse_input('\\n'.join(lines))
    parsed_args = [input_val]
else:
    # Multiple parameters - parse each line
    parsed_args = [parse_input(line) for line in lines[:${paramCount}]]

${code}

def run_solution():
    if 'Solution' in globals():
        sol = Solution()
        if hasattr(sol, "${fnName}"):
            return getattr(sol, "${fnName}")(*parsed_args)
    
    if "${fnName}" in globals():
        return globals()["${fnName}"](*parsed_args)
    
    # Fallback to any detected function
    for name, obj in globals().items():
        if callable(obj) and not name.startswith("__") and name not in ['run_solution', 'parse_input']:
             return obj(*parsed_args)
    
    return None

result = run_solution()
if isinstance(result, (list, dict)):
    print(json.dumps(result))
else:
    print(result)
`;
    }

    // JAVA
    if (language === 'JAVA') {
        // Strip 'public' modifier from any class declarations
        let sanitizedCode = code.replace(/public\s+class\s+/g, 'class ');
        
        return `
import java.util.*;
import java.io.*;
import java.util.stream.*;
import java.lang.reflect.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while(scanner.hasNextLine()) {
            String line = scanner.nextLine().trim();
            if (!line.isEmpty()) {
                lines.add(line);
            }
        }
        scanner.close();
        
        if (!lines.isEmpty()) {
            Solution solInstance = new Solution();
            Method targetMethod = null;
            
            // Find the target method
            for (Method m : Solution.class.getDeclaredMethods()) {
                if (m.getName().equals("${fnName}") || 
                    (Modifier.isPublic(m.getModifiers()) && !m.getName().equals("main"))) {
                    targetMethod = m;
                    break;
                }
            }

            if (targetMethod != null) {
                Class<?>[] paramTypes = targetMethod.getParameterTypes();
                Object[] parsedArgs = new Object[paramTypes.length];
                
                // Parse arguments based on parameter count
                for (int i = 0; i < paramTypes.length && i < lines.size(); i++) {
                    String input = lines.get(i);
                    if (input.contains("=")) {
                        input = input.split("=", 2)[1].trim();
                    }
                    parsedArgs[i] = parseInput(input, paramTypes[i]);
                }
                
                Object result = targetMethod.invoke(solInstance, parsedArgs);
                printResult(result);
            }
        }
    }

    private static Object parseInput(String input, Class<?> type) {
        input = input.trim();
        
        if (type == int.class || type == Integer.class) {
            return Integer.parseInt(input);
        }
        
        if (type == long.class || type == Long.class) {
            return Long.parseLong(input);
        }
        
        if (type == double.class || type == Double.class) {
            return Double.parseDouble(input);
        }
        
        if (type == String.class) {
            return input.replace("\\"", "").replace("'", "");
        }
        
        if (type == int[].class || type == Integer[].class) {
            String content = input.substring(1, input.length() - 1).trim();
            if (content.isEmpty()) return new int[0];
            return Arrays.stream(content.split(","))
                         .map(String::trim)
                         .mapToInt(Integer::parseInt)
                         .toArray();
        }
        
        if (type == long[].class || type == Long[].class) {
            String content = input.substring(1, input.length() - 1).trim();
            if (content.isEmpty()) return new long[0];
            return Arrays.stream(content.split(","))
                         .map(String::trim)
                         .mapToLong(Long::parseLong)
                         .toArray();
        }
        
        if (type == String[].class) {
            String content = input.substring(1, input.length() - 1).trim();
            if (content.isEmpty()) return new String[0];
            return Arrays.stream(content.split(","))
                         .map(s -> s.trim().replace("\\"", ""))
                         .toArray(String[]::new);
        }
        
        return input;
    }

    private static void printResult(Object res) {
        if (res instanceof int[]) {
            System.out.println(Arrays.toString((int[])res).replace(" ", ""));
        } else if (res instanceof long[]) {
            System.out.println(Arrays.toString((long[])res).replace(" ", ""));
        } else if (res instanceof List) {
            System.out.println(res.toString().replace(" ", ""));
        } else {
            System.out.println(res);
        }
    }
}

${sanitizedCode}
`;
    }

    return code;
}