const express = require("express");
const router = express.Router();
require("dotenv").config();

const OpenAI = require("openai");
let request_count = 0;

router.post("/", async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" },
      ],
      max_tokens: 100,
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});
router.post("/jsonTesting", async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. only return json format response.",
        },
        { role: "user", content: "Who won the world series in 2020?" },
        {
          role: "assistant",
          content: "The Los Angeles Dodgers won the World Series in 2020.",
        },
        { role: "user", content: "Where was it played?" },
      ],
      max_tokens: 100,
      response_format: { type: "json_object" },
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});
router.post("/continueTesting", async (req, res) => {
  const randomResponseTime = Math.random() * 3000;
  request_count++;
  setTimeout(() => {
    res.json({
      data: "/* [FAKE SUGGESTION # " + request_count + "] */",
    });
  }, randomResponseTime);
});
router.post("/continue", async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const instruction =
      "You will be provided with a piece of" +
      req.body.language +
      " code," +
      /*Initial Instruction-------------------------------------------------------------------------------------------------------------------------------------*/
      " As a code writer, you specialize in completing the current coding session only," +
      " focusing on unfinished functions," +
      " sentences," +
      " and classes provided in the original code file or AST." +
      /*Constraints---------------------------------------------------------------------------------------------------------------------------------------------*/
      " Your goal is to respond quickly with the most appropriate continuation of the code," +
      " strictly adhering to the necessity of completing the current session without adding extra content." +
      " You will only respond with code (without ```) and only the content you have generated," +
      " ensuring it completes the current task or pattern without worrying about the entirety of the file or future tasks." +
      " If there's nothing that you think can be added to the end of current code, return null." +
      " If the answer you provide to me will not be the code, please make it in the comment format since if you do not, it will be an error!" +
      /*Primary Tasks-------------------------------------------------------------------------------------------------------------------------------------------*/
      " Your primary tasks include" +
      " 1. Finish the unfinished function (continued), guided by comments, function name or the context of the previous code. Please, the output should be the complete function (only continued part). Please pay attention to line indentation and output the continued code. If you think there's nothing to complete, then reply 'The code provided is already complete and doesn't need any modification or completion.' And analyze what the code's about(Try to list points when you analyze);" +
      " 2. autocompleting syntax patterns such as variable declarations (missing variable declarations, constructors or functions); Please, the output should be the complete function with comments about what you did; Code formatting and line indentation are always REQUIRED (space and blank line); You do NOT need any explanations about what you did, just show the code;" +
      " 3. based on the code presented, you should follow established or current patterns to complete the code, such as iterating over table contents, similar structures or functions; Please, the output should be shown completely (only continued part) ; Code formatting and line indentation are always REQUIRED (space and blank line); You do not need any explanations." +
      " You aim to produce necessary and relevant code, avoiding unnecessary additions and always striving to complete the current coding session effectively.";

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 0.2,
      messages: [
        { role: "system", content: instruction },
        //{ role: "system", content: req.body.analyzeCode },
        { role: "user", content: req.body.prompt },
      ],
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});

router.post("/fix", async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const instruction =
      "You will be provided with a piece of " +
      req.body.language +
      " code, and your task is to" +
      " (1) find and fix logic errors in it, if necessary." +
      " (2) fix indentations, if necessary." +
      " (3) find and fix syntax errors, if necessary." +
      " Don't explain the code, just generate the code itself." +
      " Don't overthink the problem, If there's no clue, just return an empty string.";

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: req.body.prompt },
      ],
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});
router.post("/analyze", async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const descriptionWordLimit = 20;

    const instruction =
      "You will be provided with a piece of " +
      req.body.language +
      " code, and your task is to analyze the given code to a CSV format table that has the following columns," +
      " variables, functions, external libraries' name, and their usage description under" +
      String(descriptionWordLimit) +
      " characters.";

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: req.body.prompt },
      ],
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});

// Function
// analyize what function does  - description
// csv or json
// possible - function over function ( parent - child )
// input and output of function

router.post("/function_analyze", async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const descriptionWordLimit = 20;

    const instruction =
      "You will be provided with a piece of code " +
      req.body.language +
      " Your task is to analyize what the function do with Json Formate" +
      " This list should only have the following columns" +
      " name, descriptio,input type ,input variable, output type , output variable." +
      " if you cannot find the output type or output variable check what the function return or print " +
      " Give the relationship between function with arrow, if no just return none" +
      " if there is more than one function generate the list for each function ";
    //" generate the list with Json Formate.";
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        { role: "system", content: instruction },
        {
          role: "user",
          content: `
						function isPrime(num) {
							for (let i = 2; i < num; i++) {
							  if (num % i === 0) {
								return false;
							  }
							}
							return true;
						  }
						  
						  function getNextPrime() {
							prime++;
							while (!isPrime(prime)) {
							  prime++;
							}
							return prime;
						  }
					
					`,
        },
      ],
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});
//this function is written by smith chen
router.post("/analyzeFileType", async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const instruction =
      " You will be provided with a piece of " +
      " code, and your task is to get the type of files and short brief of file descriptions (50 - 100 words), in json format (format should be constant)." +
      " For example: " +
      " File name: xxx \n" +
      " File type: xxx \n" +
      " File short description: xxxxxx " +
      " If no text or code is selected, then return nothing." +
      " For example: " +
      " File name: None \n" +
      " File name: None \n" +
      " File type: None \n";

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      temperature: 0.2,
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: req.body.prompt },
      ],
      response_format: { type: "json_object" },
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});
//this function is written by smith chen
//之后要改instruction
router.post("/analyzeFrameworkStructure", async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const instruction =
      " give me a demo project framework structure (default is React) " +
      " where you list all the files in a json format" +
      " and indentation is required between primary and secondary files." +
      " Format and answers should be constant (No explanations, just list the structure)." +
      ' No prefixes like "names:" or "types:".';

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      temperature: 0,
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: req.body.prompt },
      ],
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});
//this function is written by smith chen
router.post("/analyzeFilePathes", async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const instruction =
      "You are a professional program coder,You will be provided with a piece of " +
      req.body.language +
      " code, and your task is to return a list for json variables, including belowing keys: " +
      " 1. Imported lib or object named " +
      " 2. imported path" +
      " 3. object type for Imported lib or object " +
      " 4. Description.";

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: req.body.prompt },
      ],
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});
router.post("/analyzeFunctions", async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const descriptionWordLimit = 20;

    const instruction =
      "You will be provided with a piece of code " +
      req.body.language +
      " Your task is to analyize what the function do with Json Formate" +
      " This list should only have the following columns" +
      " name, descriptio,input type ,input variable, output type , output variable." +
      " if you cannot find the output type or output variable check what the function return or print " +
      " Give the relationship between function with arrow, if no just return none" +
      " if there is more than one function generate the list for each function ";
    //" generate the list with Json Formate.";
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        { role: "system", content: instruction },
        {
          role: "user",
          content: `
						function isPrime(num) {
							for (let i = 2; i < num; i++) {
							  if (num % i === 0) {
								return false;
							  }
							}
							return true;
						  }
						  
						  function getNextPrime() {
							prime++;
							while (!isPrime(prime)) {
							  prime++;
							}
							return prime;
						  }
					
					`,
        },
      ],
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});
router.post("/analyzeExternalLibraries", async (req, res) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const descriptionWordLimit = 20;

    const instruction =
      "You will be provided with a piece of " +
      req.body.language +
      " code, and your task is to analyze the given code to a CSV format table that has the following columns," +
      " variables, functions, external libraries' name, and their usage description under" +
      String(descriptionWordLimit) +
      " characters.";

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: req.body.prompt },
      ],
    });

    res.json({
      data: chatCompletion.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.json({ openAIControllerError: String(error) });
  }
});

module.exports = router;
