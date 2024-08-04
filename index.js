const { Builder, Browser, By, Key, until } = require("selenium-webdriver");

const assert = require("assert");

async function getRecipe() {
  // launch chrome browser
  var driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("https://www.allrecipes.com/recipes/");

    await driver.findElement(By.id(`mntl-card-list-items_14-0`)).click();
    const headerDetails = await driver.findElement(
      By.id("article-header--recipe_1-0")
    );

    var recipeName;
    try {
      recipeName = await headerDetails
        .findElement(By.className("article-heading type--lion"))
        .getText();
    } catch (err) {
      var recipeName = "undefined";
    }

    var recipeDescription;
    try {
      recipeDescription = await headerDetails
        .findElement(By.className("article-subheading type--dog"))
        .getText();
    } catch (err) {
      recipeDescription = "undefiend";
    }

    // fetch details
    var recipeDetails;
    try {
      recipeDetails = await driver.findElements(
        By.className("mm-recipes-details__item")
      );

      var details = {
        prepTime: "",
        cookTime: "",
        chillTime: "",
        coolTime: "",
        totalTime: "",
        servings: "",
      };
      var index = 0;
      for (let detailItem of recipeDetails) {
        // Find all 'mm-recipes-details__value' elements within the current 'recipeDetails' item
        const detail = await detailItem
          .findElement(By.className("mm-recipes-details__value"))
          .getText();
        // Add the found 'details' elements to the 'allDetails' array
        const keys = Object.keys(details);
        const key = keys[index];
        details[key] = detail;
        index++;
      }
    } catch (err) {
      recipeDetails = [];
    }

    // console.log(details);

    // fetch ingredients
    var ingredients = [];
    try {
      const recipeIngredients = await driver.findElements(
        By.className("mm-recipes-structured-ingredients__list-item")
      );

      for (let ingredient of recipeIngredients) {
        const spans = await ingredient.findElements(By.css("span"));
        let index = 0;
        for (let spanElement of spans) {
          const text = await spanElement.getText();
          var quantity;
          var name;
          var unit;
          index === 0
            ? (quantity = text)
            : index === 1
            ? (unit = text)
            : (name = text);
          index++;
        }
        ingredients.push({ name: name, quantity: quantity, unit: unit });
      }
    } catch (err) {
      console.log("faild to fetch ingredients");
    }

    // console.log(ingredients);

    const recipeInstructions = await driver.findElements(
      By.className("comp mntl-sc-block mntl-sc-block-html")
    );
    const instructions = [];
    index = 1;
    for (let instruction of recipeInstructions) {
      instructions.push({
        step: index,
        description: await instruction.getText(),
      });
      index++;
    }

    // console.log(instructions);

    const recipe = {
      title: recipeName,
      description: recipeDescription,
      details: details,
      ingredients: ingredients,
      instructions: instructions,
    };
    console.log(recipe);
    // } catch (err) {
    //   console.log("error in element number " + amount);
    //   return;
    // }
    // }
  } finally {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    await driver.quit();
  }
}

getRecipe();
