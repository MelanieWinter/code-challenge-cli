#!/usr/bin/env node

import fs from 'fs/promises';
import inquirer from 'inquirer';
import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';

let playerName;
const sleep = (ms = 2000) =>  new Promise((r) => setTimeout(r, ms))

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow(
        "77 JavaScript Questions\n"

    )
    await sleep()
    rainbowTitle.stop()

    console.log(`
        ${chalk.bgBlue('HOW TO PLAY')}
        Choose the correct answer
    `)
}

async function loadQuestions() {
    try {
        const data = await fs.readFile('questions_with_choices_and_answers.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading questions:', error);
        process.exit(1);
    }
}

async function askName() {
    const answers = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'What is your name?',
        default() {
            return 'Player';
        },
    });
    return answers.player_name;
}

async function askQuestion(question) {
    const answers = await inquirer.prompt({
        name: 'selected_answer',
        type: 'list',
        message: question.question,
        choices: question.choices,
    });
    return answers.selected_answer === question.answer;
}

async function handleQuestion(question) {
    const isCorrect = await askQuestion(question);
    const spinner = createSpinner('Checking answer...').start();
    await sleep()
    if (isCorrect) {
        spinner.success({
            text: `Nice work ${playerName}.`
        })
    } else {
        spinner.error({
            text: `☠️ Game over, you lose ${playerName}! ☠️`
        })
        process.exit(1)
    }
    return isCorrect;
}

async function main() {
    await welcome();
    playerName = await askName();
    const questions = await loadQuestions();
    let allCorrect = true; // Track if all questions are answered correctly
    for (let i = 0; i < questions.length; i++) {
        console.log(`\nQuestion ${i + 1}/${questions.length}:`);
        const isCorrect = await handleQuestion(questions[i]);
        if (!isCorrect) {
            allCorrect = false; 
            break; 
        }
    }
    if (allCorrect) {
        winner(); 
    } else {
        console.log(chalk.red(figlet.textSync(`Game Over ${playerName}!`, { horizontalLayout: 'full' })));
    }
}

function winner() {
    console.clear()
    const msg = `Congrats ${playerName},\n
    you win\n
    $1,000,000!!!`

    figlet(msg, (err, data) => {
        console.log(gradient.fruit.multiline(data))
    })
}

main();
