// import puppeteer from "puppeteer";
// import fs from "fs/promises";

// async function start() {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto("https://www.includehelp.com/mcq/javascript-multiple-choice-questions-mcqs.aspx");

//     const questionsWithChoices = await page.$$eval('p > b', elements => {
//         const questionsWithChoices = [];
//         for (const element of elements) {
//             const text = element.textContent.trim();
//             const olElement = element.closest('p').nextElementSibling;
//             if (olElement && olElement.tagName === 'OL') {
//                 const choiceElements = Array.from(olElement.querySelectorAll('li'));
//                 const choices = choiceElements.map(choiceElement => choiceElement.textContent.trim());
//                 const answerElement = olElement.nextElementSibling;
//                 let answer = null;
//                 if (answerElement && answerElement.tagName === 'P') {
//                     const boldTag = answerElement.querySelector('b');
//                     if (boldTag && boldTag.textContent.trim() === 'Answer:') {
//                         answer = boldTag.nextSibling.textContent.trim();
//                         // Remove the beginning letter and any punctuation marks
//                         answer = answer.replace(/^[A-Z]\)\s*/, '');
//                     }
//                 }
//                 questionsWithChoices.push({
//                     question: text,
//                     choices: choices,
//                     answer: answer
//                 });
//             }
//         }
//         return questionsWithChoices;
//     });

//     const formattedData = questionsWithChoices.map(q => {
//         const choicesText = q.choices.join('\n');
//         return `${q.question}\n${choicesText}\n${q.answer}\n`;
//     }).join('\n\n');
//     await fs.writeFile('questions_with_choices_and_answers.txt', formattedData);

//     await browser.close();
// }

// start();

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
                        // Remove the beginning letter and any punctuation marks
                        answer = answer.replace(/^[A-Z]\)\s*/, '');
                    }
                }
                return {
                    question: text,
                    choices: choices,
                    answer: answer
                };
            }
        }).filter(Boolean); // Remove any undefined elements
    });

    await fs.writeFile('questions_with_choices_and_answers.json', JSON.stringify(questionsWithChoices, null, 2));

    await browser.close();
}

start();
