import puppeteer from "puppeteer-core";
import readlineSync from 'readline-sync';
import { config } from 'dotenv';
config();

async function getRandomCodeWarsChallenge() {
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        // const email = readlineSync.question('Enter your email: ');
        // const password = readlineSync.question('Enter your password (input will be hidden): ', {
        //     hideEchoBack: true // Hide user input (password)
        // });

        
        await page.goto('https://www.codewars.com/users/sign_in');
        await page.screenshot({ path: 'codewars.png' });
        console.log('Screenshot taken. Check codewars.png');

        // Fill in the sign-in form with the provided email and password
        // await page.type('#user_email', email);
        // await page.type('#user_password', password);
        // await page.click('[type="submit"]');

        // temporary sign in
        await page.type('#user_email', process.env.EMAIL);
        await page.type('#user_password', process.env.PASSWORD);
        await page.click('[type="submit"]');

        // Wait for sign-in to complete
        await page.waitForNavigation();

        await page.screenshot({ path: 'codewars.png' });

        await fetchAndDisplayChallenge(page);
        await page.screenshot({ path: 'codewars.png' });

        await handleUserChoice(page, browser);
        await page.waitForNavigation();

        console.log('Action completed successfully!');
    } catch (error) {
        console.error('Failed to fetch challenge:', error);
    } finally {
        await browser.close();
    }
}

async function handleUserChoice(page, browser) {
    const choice = readlineSync.keyInSelect(['Train', 'Skip'], 'What would you like to do?');

    if (choice === -1 && browser) {
        console.log('Cancelling...');
        await browser.close(); // Close the browser if the user cancels
        return;
    } else if (choice === 0) {
        console.log('Training...');
        await page.click('#personal-trainer-play');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.screenshot({ path: 'codewars.png' });
        console.log('Screenshot taken. Check codewars.png');

        // Allow the user to input their solution
        const solution = readlineSync.question('Enter your solution: ');

        // Once the user enters their solution and hits enter, click on the "Test" button
        if (solution) {
            await page.click('#validate_btn');
            console.log('Validating...')
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.screenshot({ path: 'codewars.png' });
            console.log('Screenshot taken. Check codewars.png');
            await page.waitForSelector('.run-results');
            const runResultsText = await page.evaluate(() => {
                const runResultsDiv = document.querySelector('.run-results');
                return runResultsDiv ? runResultsDiv.textContent : 'No results found';
            });

            console.log(runResultsText); // Log the text content to the console
        }
    } else if (choice === 1) {
        console.log('Skipping...');
        await page.click('#personal-trainer-skip');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await fetchAndDisplayChallenge(page);

        await page.screenshot({ path: 'codewars.png' });
        console.log('Screenshot taken. Check codewars.png');

        await handleUserChoice(page, browser);
    }
}

async function fetchAndDisplayChallenge(page) {
    // await page.waitForSelector('#trainer-next-challenge');
    // await page.waitForSelector('.markdown');
    // const challengeInfo = await page.$eval('#trainer-next-challenge', challenge => {
    //     const smallHex = challenge.querySelector('.inner-small-hex span').textContent.trim();
    //     const challengeTitle = challenge.querySelector('.text-ui-text').textContent.trim();
    //     const description = challenge.querySelector('.markdown').textContent.trim();

    //     return {
    //         smallHex,
    //         challengeTitle,
    //         description
    //     };
    // });

    // console.log('Small Hex:', challengeInfo.smallHex);
    // console.log('Challenge Title:', challengeInfo.challengeTitle);
    // console.log('Description:', challengeInfo.description);

    const challengeInfo = await page.$('#trainer-next-challenge')
    console.log(challengeInfo)
}

// Call the function to start the process
getRandomCodeWarsChallenge();