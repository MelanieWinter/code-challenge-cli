import puppeteer from "puppeteer";
import fs from "fs/promises";

async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.includehelp.com/mcq/javascript-multiple-choice-questions-mcqs.aspx");

    const questionsWithChoices = await page.$$eval('p > b', elements => {
        return elements.map(element => {
            const text = element.textContent.trim();
            const olElement = element.closest('p').nextElementSibling;
            if (olElement && olElement.tagName === 'OL') {
                const choiceElements = Array.from(olElement.querySelectorAll('li'));
                const choices = choiceElements.map(choiceElement => choiceElement.textContent.trim());
                const answerElement = olElement.nextElementSibling;
                let answer = null;
                if (answerElement && answerElement.tagName === 'P') {
                    const boldTag = answerElement.querySelector('b');
                    if (boldTag && boldTag.textContent.trim() === 'Answer:') {
                        answer = boldTag.nextSibling.textContent.trim();
                        answer = answer.replace(/^[A-Z]\)\s*/, '');
                    }
                }
                return {
                    question: text,
                    choices: choices,
                    answer: answer
                };
            }
        }).filter(Boolean); 
    });

    await fs.writeFile('questions_with_choices_and_answers.json', JSON.stringify(questionsWithChoices, null, 2));

    await browser.close();
}

start();
