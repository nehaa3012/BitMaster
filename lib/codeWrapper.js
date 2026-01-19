// Helper to find function name
function findFunctionName(code, lang) {
    if (lang === 'JAVASCRIPT') {
        const match = code.match(/var\s+(\w+)\s*=\s*function/);
        if (match) return match[1];
        const matchFn = code.match(/function\s+(\w+)\s*\(/);
        if (matchFn) return matchFn[1];
    } else if (lang === 'PYTHON') {
        const matches = [...code.matchAll(/def\s+([a-zA-Z_]\w*)\s*\(/g)];
        for (const m of matches) {
            if (m[1] !== "__init__") {
                return m[1];
            }
        }
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
    return 1;
}

export function detectProblemType(snippet) {
    if (snippet.includes('@param {number}')) return 'NUMBER';
    if (snippet.includes('@param {string}')) return 'STRING';
    if (snippet.includes('ListNode') || snippet.includes('linked list')) return 'LINKED_LIST';
    if (snippet.includes('TreeNode') || snippet.includes('binary tree')) return 'BINARY_TREE';
    return 'STRING';
}

// Generic Wrapper Generator
export function generateWrapper(language, code, problemType) {
    const fnName = findFunctionName(code, language);
    const paramCount = countFunctionParams(code, language);

    // JAVASCRIPT
    if (language === 'JAVASCRIPT') {
        return `
const fs = require("fs");
const rawInput = fs.readFileSync(0, "utf8").trim();

// ============ DATA STRUCTURE HELPERS ============

// Linked List helpers
function arrayToLinkedList(arr) {
    if (!arr || arr.length === 0) return null;
    let head = { val: arr[0], next: null };
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = { val: arr[i], next: null };
        current = current.next;
    }
    return head;
}

function linkedListToArray(head) {
    const result = [];
    let current = head;
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    return result;
}

// Binary Tree helpers
function arrayToTree(arr) {
    if (!arr || arr.length === 0) return null;
    
    let root = { val: arr[0], left: null, right: null };
    let queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
        let node = queue.shift();
        
        if (i < arr.length && arr[i] !== null) {
            node.left = { val: arr[i], left: null, right: null };
            queue.push(node.left);
        }
        i++;
        
        if (i < arr.length && arr[i] !== null) {
            node.right = { val: arr[i], left: null, right: null };
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}

function treeToArray(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        if (node === null) {
            result.push(null);
        } else {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        }
    }
    
    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }
    
    return result;
}

// ============ INPUT PARSING ============

function parseInput(input, problemType) {
    if (input.includes('=')) {
        input = input.split('=').pop().trim();
    }
    
    let parsed;
    try {
        parsed = JSON.parse(input);
    } catch(e) {
        if (!isNaN(input)) {
            return Number(input);
        }
        return input.replace(/^["']|["']$/g, '');
    }
    
    // Convert to appropriate data structure
    if (problemType === 'LINKED_LIST' && Array.isArray(parsed)) {
        return arrayToLinkedList(parsed);
    }
    
    if (problemType === 'BINARY_TREE' && Array.isArray(parsed)) {
        return arrayToTree(parsed);
    }
    
    return parsed;
}

function splitInput(input, expectedParams) {
    const lines = input.split('\\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length >= expectedParams) {
        return lines.slice(0, expectedParams);
    }
    
    const parts = [];
    let current = '';
    let depth = 0;
    
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        if (char === '[' || char === '{') depth++;
        if (char === ']' || char === '}') depth--;
        
        if (char === ',' && depth === 0) {
            parts.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    if (current.trim()) {
        parts.push(current.trim());
    }
    
    return parts.length >= expectedParams ? parts.slice(0, expectedParams) : [input];
}

// ============ MAIN EXECUTION ============

const inputParts = splitInput(rawInput, ${paramCount});
const parsedArgs = inputParts.map(input => parseInput(input, "${problemType}"));

${code}

const result = ${fnName}(...parsedArgs);

// Convert result back to appropriate format
if (result === null || result === undefined) {
    // Handle null/undefined based on problem type
    if ("${problemType}" === "LINKED_LIST" || "${problemType}" === "BINARY_TREE") {
        console.log(JSON.stringify([]));
    } else {
        console.log(JSON.stringify(result));
    }
} else if (typeof result === 'object' && 'val' in result) {
    if ('next' in result) {
        // Linked List
        console.log(JSON.stringify(linkedListToArray(result)));
    } else if ('left' in result || 'right' in result) {
        // Binary Tree
        console.log(JSON.stringify(treeToArray(result)));
    } else {
        console.log(JSON.stringify(result));
    }
} else if (typeof result === 'object') {
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
from collections import deque
import inspect

# ============ DATA STRUCTURES ============

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def array_to_linked_list(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    cur = head
    for v in arr[1:]:
        cur.next = ListNode(v)
        cur = cur.next
    return head

def linked_list_to_array(head):
    res = []
    while head:
        res.append(head.val)
        head = head.next
    return res

def array_to_tree(arr):
    if not arr:
        return None
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            q.append(node.right)
        i += 1
    return root

def tree_to_array(root):
    if not root:
        return []
    res = []
    q = deque([root])
    while q:
        node = q.popleft()
        if node:
            res.append(node.val)
            q.append(node.left)
            q.append(node.right)
        else:
            res.append(None)
    while res and res[-1] is None:
        res.pop()
    return res

# ============ INPUT PARSING ============

raw_input = sys.stdin.read().strip()

def parse_input(s, problem_type):
    if "=" in s:
        s = s.split("=", 1)[1].strip()

    try:
        parsed = json.loads(s)
    except:
        try:
            return int(s) if "." not in s else float(s)
        except:
            # ✅ SAFE STRING HANDLING
            return s.strip().strip('"').strip("'")

    if problem_type == "LINKED_LIST" and isinstance(parsed, list):
        return array_to_linked_list(parsed)

    if problem_type == "BINARY_TREE" and isinstance(parsed, list):
        return array_to_tree(parsed)

    return parsed

def split_input(s, expected):
    lines = [l.strip() for l in s.splitlines() if l.strip()]
    if len(lines) >= expected:
        return lines[:expected]

    parts = []
    cur = ""
    depth = 0

    for ch in s:
        if ch in "[{":
            depth += 1
        elif ch in "]}":
            depth -= 1

        if ch == "," and depth == 0:
            parts.append(cur.strip())
            cur = ""
        else:
            cur += ch

    if cur.strip():
        parts.append(cur.strip())

    return parts[:expected] if len(parts) >= expected else [s]

# ============ USER CODE INJECTION ============
${code}
# ============ END USER CODE ============

# ============ SOLUTION RESOLUTION ============

def resolve_and_run(parsed_args, fn_name):
    if "Solution" in globals():
        sol = Solution()
        if fn_name != "__init__" and hasattr(sol, fn_name):
            method = getattr(sol, fn_name)
            if callable(method):
                return method(*parsed_args)

    if fn_name in globals() and inspect.isfunction(globals()[fn_name]):
        return globals()[fn_name](*parsed_args)

    for name, obj in globals().items():
        if inspect.isfunction(obj) and not name.startswith("__"):
            if name not in (
                "resolve_and_run",
                "parse_input",
                "split_input",
                "array_to_linked_list",
                "linked_list_to_array",
                "array_to_tree",
                "tree_to_array"
            ):
                return obj(*parsed_args)

    return None

# ============ MAIN EXECUTION ============

PROBLEM_TYPE = "${problemType}"
FN_NAME = "${fnName}"
PARAM_COUNT = ${paramCount}

input_parts = split_input(raw_input, PARAM_COUNT)
parsed_args = [parse_input(p, PROBLEM_TYPE) for p in input_parts]

result = resolve_and_run(parsed_args, FN_NAME)

# ============ OUTPUT ============

if result is None:
    print(json.dumps([] if PROBLEM_TYPE in ("LINKED_LIST", "BINARY_TREE") else None))
elif isinstance(result, ListNode):
    print(json.dumps(linked_list_to_array(result)))
elif isinstance(result, TreeNode):
    print(json.dumps(tree_to_array(result)))
elif isinstance(result, (list, dict)):
    print(json.dumps(result))
else:
    print(result)

`;
    }

    // JAVA
    if (language === 'JAVA') {
        const importRegex = /^import\s+[\w.*]+;\s*$/gm;
        const userImports = code.match(importRegex) || [];
        const codeWithoutImports = code.replace(importRegex, '');
        let sanitizedCode = codeWithoutImports.replace(/public\s+class\s+/g, 'class ');

        return `
${userImports.join('\n')}
import java.util.*;
import java.io.*;
import java.util.stream.*;
import java.lang.reflect.*;

// ============ DATA STRUCTURE DEFINITIONS ============

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Main {
    
    // ============ DATA STRUCTURE HELPERS ============
    
    private static ListNode arrayToLinkedList(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        
        return head;
    }
    
    private static int[] linkedListToArray(ListNode head) {
        List<Integer> result = new ArrayList<>();
        ListNode current = head;
        
        while (current != null) {
            result.add(current.val);
            current = current.next;
        }
        
        return result.stream().mapToInt(Integer::intValue).toArray();
    }
    
    private static TreeNode arrayToTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        
        return root;
    }
    
    private static Integer[] treeToArray(TreeNode root) {
        if (root == null) return new Integer[0];
        
        List<Integer> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                result.add(null);
            } else {
                result.add(node.val);
                queue.offer(node.left);
                queue.offer(node.right);
            }
        }
        
        // Remove trailing nulls
        while (!result.isEmpty() && result.get(result.size() - 1) == null) {
            result.remove(result.size() - 1);
        }
        
        return result.toArray(new Integer[0]);
    }
    
    // ============ MAIN EXECUTION ============
    
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        StringBuilder sb = new StringBuilder();
        while(scanner.hasNextLine()) {
            sb.append(scanner.nextLine());
            sb.append("\\n");
        }
        scanner.close();
        String rawInput = sb.toString().trim();
        
        if (!rawInput.isEmpty()) {
            Solution solInstance = new Solution();
            Method targetMethod = null;
            
            for (Method m : Solution.class.getDeclaredMethods()) {
                if (m.getName().equals("${fnName}") || 
                    (Modifier.isPublic(m.getModifiers()) && !m.getName().equals("main"))) {
                    targetMethod = m;
                    break;
                }
            }

            if (targetMethod != null) {
                Class<?>[] paramTypes = targetMethod.getParameterTypes();
                List<String> inputParts = splitInput(rawInput, paramTypes.length);
                Object[] parsedArgs = new Object[paramTypes.length];
                
                for (int i = 0; i < paramTypes.length && i < inputParts.size(); i++) {
                    String input = inputParts.get(i);
                    if (input.contains("=")) {
                        input = input.split("=", 2)[1].trim();
                    }
                    parsedArgs[i] = parseInput(input, paramTypes[i], "${problemType}");
                }
                
                Object result = targetMethod.invoke(solInstance, parsedArgs);
                printResult(result);
            }
        }
    }
    
    private static List<String> splitInput(String input, int expectedParams) {
        List<String> lines = Arrays.stream(input.split("\\n"))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());
        
        if (lines.size() >= expectedParams) {
            return lines.subList(0, expectedParams);
        }
        
        List<String> parts = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        int depth = 0;
        
        for (char c : input.toCharArray()) {
            if (c == '[' || c == '{') depth++;
            if (c == ']' || c == '}') depth--;
            
            if (c == ',' && depth == 0) {
                parts.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        
        if (current.length() > 0) {
            parts.add(current.toString().trim());
        }
        
        return parts.size() >= expectedParams ? parts.subList(0, expectedParams) : Arrays.asList(input);
    }

    private static Object parseInput(String input, Class<?> type, String problemType) {
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
        
        if (type == ListNode.class && problemType.equals("LINKED_LIST")) {
            int[] arr = parseIntArray(input);
            return arrayToLinkedList(arr);
        }
        
        if (type == TreeNode.class && problemType.equals("BINARY_TREE")) {
            Integer[] arr = parseIntegerArray(input);
            return arrayToTree(arr);
        }
        
        if (type == int[].class || type == Integer[].class) {
            return parseIntArray(input);
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
    
    private static int[] parseIntArray(String input) {
        String content = input.substring(1, input.length() - 1).trim();
        if (content.isEmpty()) return new int[0];
        return Arrays.stream(content.split(","))
                     .map(String::trim)
                     .mapToInt(Integer::parseInt)
                     .toArray();
    }
    
    private static Integer[] parseIntegerArray(String input) {
        String content = input.substring(1, input.length() - 1).trim();
        if (content.isEmpty()) return new Integer[0];
        return Arrays.stream(content.split(","))
                     .map(String::trim)
                     .map(s -> s.equals("null") ? null : Integer.parseInt(s))
                     .toArray(Integer[]::new);
    }

    private static void printResult(Object res) {
        if (res == null) {
            // Handle null based on problem type
            System.out.println("[]");
        } else if (res instanceof ListNode) {
            System.out.println(Arrays.toString(linkedListToArray((ListNode)res)).replace(" ", ""));
        } else if (res instanceof TreeNode) {
            System.out.println(Arrays.toString(treeToArray((TreeNode)res)).replace(" ", ""));
        } else if (res instanceof int[]) {
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