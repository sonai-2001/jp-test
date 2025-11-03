export function numberToIndianCurrencyWords(input: number | string): string {
    let num: number = Number(input); // Ensure input is a number
    if (isNaN(num)) return "Invalid number";

    const ones: string[] = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens: string[] = ["Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens: string[] = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function convertLessThanThousand(n: number): string {
        if (n === 0) return "";
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 11];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
        return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertLessThanThousand(n % 100) : "");
    }

    function convertIntegerPart(n: number): string {
        if (n === 0) return "Zero";
        let word: string = "";
        
        let crore: number = Math.floor(n / 10000000);
        n %= 10000000;
        let lakh: number = Math.floor(n / 100000);
        n %= 100000;
        let thousand: number = Math.floor(n / 1000);
        n %= 1000;
        let remainder: number = n;

        if (crore) word += convertLessThanThousand(crore) + " Crore ";
        if (lakh) word += convertLessThanThousand(lakh) + " Lakh ";
        if (thousand) word += convertLessThanThousand(thousand) + " Thousand ";
        if (remainder) word += convertLessThanThousand(remainder);

        return word.trim();
    }

    function convertDecimalPart(n: number): string {
        if (n === 0) return "";
        return convertLessThanThousand(n);
    }

    let [integerPart, decimalPart] = num.toFixed(2).split(".");

    let integerWords: string = convertIntegerPart(parseInt(integerPart));
    let decimalWords: string = convertDecimalPart(parseInt(decimalPart));

    let result: string = integerWords ? `${integerWords} Rupees` : "Zero Rupees";
    if (decimalWords) result += ` and ${decimalWords} Paise`;

    return result;
}