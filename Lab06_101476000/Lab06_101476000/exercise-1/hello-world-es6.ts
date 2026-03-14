let greeter = (firstName: string, lastName: string): string => {
    return `Hello, ${firstName} ${lastName}`;
};

let firstName = "Jane";
let lastName = "User";
console.log(greeter(firstName, lastName));
