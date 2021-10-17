import readline from 'readline';

const GREEN = '\u001b[32m';

export class Questionnaire {

    static question = (question: string) => {
        const readLineInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            readLineInterface.question(GREEN + question, (answer) => {
                resolve(answer);
                readLineInterface.close();
            })
        })
    }

    static PRE_BORDER = "=============================================\n> ";
    static POST_BORDER = "\n============================================\n";

    static questionWithOptions = (question: string, options: string[]) : Promise<number> => {
        const readLineInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise<number>((resolve) => {
            let optionString = question;
            options.forEach((option, i) => {
                optionString = optionString + " " + (i + 1) + ":" + option;
            });
            optionString = Questionnaire.PRE_BORDER + optionString + Questionnaire.POST_BORDER;
            readLineInterface.question(GREEN + optionString, (answer) => {
                let num = Number(answer);
                if (num < 1 || num > options.length) {
                    num = NaN;
                }
                if (num != NaN) {
                    num = num - 1;
                }
                resolve(num);
                readLineInterface.close();
            })
        })
    }
}