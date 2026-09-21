const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question.model');
const Admin = require('../models/Admin.model');

// Load env
dotenv.config();

const questions = [
  {
    paperOrder: 1,
    category: 'C',
    text: 'What is the output?\n\nint x = 5;\nprintf("%d", x++);',
    options: ['4', '5', '6', 'Error'],
    correctIndex: 1,
    explanation: '`x++` uses the value first, then increments it.'
  },
  {
    paperOrder: 2,
    category: 'C',
    text: 'Which operator is used to get the address of a variable in C?',
    options: ['*', '&', '@', '#'],
    correctIndex: 1,
    explanation: 'The address-of operator is `&`.'
  },
  {
    paperOrder: 3,
    category: 'C',
    text: 'What does sizeof(char) return in C?',
    options: ['0', '1', '2', 'Depends on compiler'],
    correctIndex: 1,
    explanation: '`sizeof(char)` is always 1 byte in C.'
  },
  {
    paperOrder: 4,
    category: 'Python',
    text: 'What is the output?\n\nx = [1, 2, 3]\nprint(x[-1])',
    options: ['1', '2', '3', 'Error'],
    correctIndex: 2,
    explanation: '`x[-1]` accesses the last list element in Python.'
  },
  {
    paperOrder: 5,
    category: 'Python',
    text: 'What is the output?\n\nprint(10 // 3)',
    options: ['3.33', '3', '4', '1'],
    correctIndex: 1,
    explanation: '`//` performs floor division.'
  },
  {
    paperOrder: 6,
    category: 'Java',
    text: 'Which of these is NOT a primitive data type in Java?',
    options: ['int', 'boolean', 'String', 'char'],
    correctIndex: 2,
    explanation: '`String` is a class, not a primitive type.'
  },
  {
    paperOrder: 7,
    category: 'Java',
    text: 'What is the default value of an int instance variable in Java?',
    options: ['0', '1', 'null', 'Garbage value'],
    correctIndex: 0,
    explanation: 'The default value of an integer instance variable is `0`.'
  },
  {
    paperOrder: 8,
    category: 'Java',
    text: 'Which keyword prevents a method from being overridden?',
    options: ['static', 'final', 'private', 'constant'],
    correctIndex: 1,
    explanation: 'A `final` method cannot be overridden.'
  },
  {
    paperOrder: 9,
    category: 'OOP',
    text: 'Which concept allows the same method name to have different parameters?',
    options: ['Inheritance', 'Encapsulation', 'Method overloading', 'Abstraction'],
    correctIndex: 2,
    explanation: 'Same method name with different parameters.'
  },
  {
    paperOrder: 10,
    category: 'C++',
    text: 'Which of the following is valid extension for C++?',
    options: ['.cpp', '.cxx', '.hpp', '.class'],
    correctIndex: 0,
    explanation: '`.cpp` is a standard C++ source-file extension.'
  },
  {
    paperOrder: 11,
    category: 'C',
    text: 'What is the output?\n\n#include <stdio.h>\nint main() {\n    int a = 5;\n    printf("%d %d", a++, ++a);\n    return 0;\n}',
    options: ['5 7', '6 7', 'Undefined behavior', '5 6'],
    correctIndex: 2,
    explanation: '`a` is modified more than once without a sequencing guarantee.'
  },
  {
    paperOrder: 12,
    category: 'C',
    text: 'What is the output?\n\nint x = 10;\nint *p = &x;\nprintf("%d", *p + 5);',
    options: ['Address of x', '10', '15', 'Error'],
    correctIndex: 2,
    explanation: '`*p` is `10`; `10 + 5 = 15`.'
  },
  {
    paperOrder: 13,
    category: 'Python',
    text: 'What is the output?\n\na = [1, 2, 3]\nprint(a * 2)',
    options: ['[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', '[1, 4, 9]', 'Error'],
    correctIndex: 1,
    explanation: 'List multiplication repeats the list.'
  },
  {
    paperOrder: 14,
    category: 'Python',
    text: 'What is the output?\n\nx = 10\ndef test():\n    x = 20\ntest()\nprint(x)',
    options: ['10', '20', 'None', 'Error'],
    correctIndex: 0,
    explanation: 'The `x` inside `test()` is local; the global `x` remains `10`.'
  },
  {
    paperOrder: 15,
    category: 'Python',
    text: 'Which keyword is used to refer to the current object?',
    options: ['super', 'this', 'self', 'current'],
    correctIndex: 2,
    explanation: '`self` refers to the current object in Python.'
  },
  {
    paperOrder: 16,
    category: 'Java',
    text: 'What is the output?\n\nString s = "Java";\ns.concat(" Programming");\nSystem.out.println(s);',
    options: ['Java Programming', 'Java', 'Programming', 'Error'],
    correctIndex: 1,
    explanation: 'Java strings are immutable; the result of `concat()` is not assigned.'
  },
  {
    paperOrder: 17,
    category: 'C',
    text: 'Which operator has higher precedence?',
    options: ['+', '*', '=', '&&'],
    correctIndex: 1,
    explanation: 'Multiplication has higher precedence than `+`, `=`, and `&&`.'
  },
  {
    paperOrder: 18,
    category: 'C',
    text: 'Which function is used to compare two strings?',
    options: ['strcmp()', 'strcompare()', 'compare()', 'stringcmp()'],
    correctIndex: 0,
    explanation: 'C uses `strcmp()` to compare strings.'
  },
  {
    paperOrder: 19,
    category: 'Python',
    text: 'What is the output?\n\nx = {"a": 1, "b": 2}\nprint("a" in x)',
    options: ['True', 'False', '1', 'Error'],
    correctIndex: 0,
    explanation: 'The `in` operator checks dictionary keys, and `"a"` is a key.'
  },
  {
    paperOrder: 20,
    category: 'OOP',
    text: 'Which keyword is used to call the parent-class constructor?',
    options: ['this', 'parent', 'super', 'base'],
    correctIndex: 2,
    explanation: '`super` is used to call the parent-class constructor.'
  },
  {
    paperOrder: 21,
    category: 'Java',
    text: 'Which is an unchecked exception?',
    options: ['IOException', 'SQLException', 'NullPointerException', 'FileNotFoundException'],
    correctIndex: 2,
    explanation: 'It is an unchecked runtime exception.'
  },
  {
    paperOrder: 22,
    category: 'Java',
    text: 'Which keyword cannot be used with a class?',
    options: ['final', 'abstract', 'static', 'public'],
    correctIndex: 2,
    explanation: 'A top-level Java class cannot be declared `static`.'
  },
  {
    paperOrder: 23,
    category: 'Python',
    text: 'What is the output?\n\nprint(2 ** 3 ** 2)',
    options: ['64', '512', '36', '256'],
    correctIndex: 1,
    explanation: 'Exponentiation is right-associative: `2 ** (3 ** 2) = 512`.'
  },
  {
    paperOrder: 24,
    category: 'SQL',
    text: 'Which key uniquely identifies each record in a table?',
    options: ['Foreign key', 'Primary key', 'Candidate key', 'Alternate key'],
    correctIndex: 1,
    explanation: 'A primary key uniquely identifies each record.'
  },
  {
    paperOrder: 25,
    category: 'Java',
    text: 'Identify all the types of errors present in the following code.\n\npublic class Test {\n    public static void main(String[] args) {\n\n        int[] a = {10, 20, 30};\n\n        int sum = 0;\n\n        for(int i = 0; i <= a.length; i++) {\n            sum += a[i];\n        }\n\n        int average = sum / 0;\n\n        String result = null;\n\n        if(result == "Pass") {\n            System.out.println("Passed");\n        }\n    }\n}',
    options: ['Syntax Error + Logical Error', 'Compilation Error + Runtime Error + Logical Error', 'Runtime Error + Logical Error', 'Syntax Error + Runtime Error + Logical Error'],
    correctIndex: 2,
    explanation: 'The loop throws ArrayIndexOutOfBoundsException and division by zero throws ArithmeticException (Runtime Errors). Comparing a String to null using == and expecting a match is a Logical Error.'
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quizapp';
    console.log(`[SEED] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[SEED] Clearing existing questions...');
    await Question.deleteMany({});

    console.log(`[SEED] Inserting ${questions.length} questions matching official answer key...`);
    await Question.insertMany(questions);

    console.log('[SEED] Checking admin user credentials...');
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let admin = await Admin.findOne({ username: adminUsername });
    if (!admin) {
      admin = new Admin({ username: adminUsername, password: adminPassword });
      await admin.save();
      console.log(`[SEED] Admin account created: username='${adminUsername}', password='${adminPassword}'`);
    } else {
      console.log(`[SEED] Admin account '${adminUsername}' already exists.`);
    }

    console.log('======================================================');
    console.log(`  [SEED SUCCESS] ${questions.length} Questions Synced with Answer Key  `);
    console.log('======================================================');
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed database:', error);
    process.exit(1);
  }
}

seedDatabase();
