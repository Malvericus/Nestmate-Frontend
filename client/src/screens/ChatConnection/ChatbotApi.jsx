const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBmTr1Zdz6uPbBYkZAUqXruFeyJ0mlJy7w";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "Nestmate-Assistant" });

const API = {
  GetChatbotResponse: async (message) => {
    try {
      const prompt = message;
      const result = await model.generateContent(prompt);
      return result.response.text(); // Returning the chatbot response
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      return "Sorry, I couldn't process that.";
    }
  }
};

export default API;
