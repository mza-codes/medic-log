## Issues Related to logout

Since we are using native array.push and filter method on different javascript files,native checks like <strong> if(!tokens.includes(currentToken)) </strong>
returns falsy value, therefore server gives the token depreceated/expired error. This happened after implemented logout fuctionality where we filter current token and returns new array with only exists in the authcontrollers.js file. For the case of checkCookie middleware the array is not updated and therefore returns an error.

### This can be prevented by implementing db based sessions. eg: redis,mongodb new data model etc.

## Please keep the message till fixing the issue !