// Declare global variables
var Sets;   // List of parsed sets
var Terms;  // List of filtered terms
var Term;   // Index of current term



// Load the document
function Load() {
    // Add event Listener
    var input = document.getElementById("quizzerInput");
    input.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) { 
            // Key was enter
            if (input.readOnly) {
                Reset();
            }
            else {
                Check();
            } 
        }
    });

    // Show and hide elements
    document.getElementById("settings").hidden = false;
    document.getElementById("quizzer").hidden = true;
    document.getElementById("settingsError").textContent = "";

    // Load CSVs
    Sets = [null, null, null, null, null, null, null, null, null];
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Verbs.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[0] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Prepositions.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[1] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Weather.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[2] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Family.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[3] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Cloths.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[4] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Nature.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[5] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/House.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[6] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Vacation.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[7] = results.data;
        }
    });
    Papa.parse("https://raw.githubusercontent.com/AsherMorgan/Spanish-Quizzer/master/Vocab/Childhood.csv", {
        download: true,
        complete: function(results) {
            // Set verbs
            Sets[8] = results.data;
        }
    });
}



// Shuffle the list of terms
function ShuffleTerms() {
    var currentIndex = Terms.length, temporaryValue, randomIndex;
    
    // While there are more elements to shuffle
    while (0 !== currentIndex) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        // Swap the two elements
        temporaryValue = Terms[currentIndex];
        Terms[currentIndex] = Terms[randomIndex];
        Terms[randomIndex] = temporaryValue;
    }
}



// Start the quizzer
function Start() {
    // Filter and load Sets into Terms
    Terms = [];
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode0").value).Apply(Sets[0]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode1").value).Apply(Sets[1]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode2").value).Apply(Sets[2]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode3").value).Apply(Sets[3]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode4").value).Apply(Sets[4]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode5").value).Apply(Sets[5]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode6").value).Apply(Sets[6]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode7").value).Apply(Sets[7]));
    Terms.push(...Filter.GetFilter(document.getElementById("settingsMode8").value).Apply(Sets[8]));

    // Shuffle terms
    ShuffleTerms();

    // Validate Terms
    if (Terms.length == 0) {
        document.getElementById("settingsError").textContent = "Your custom vocabulary set must contain at least one term.";
        return;
    }

    // Show and hide elements
    document.getElementById("settings").hidden = true;
    document.getElementById("quizzer").hidden = false;

    // Give the user a prompt
    Term = -1;
    Reset();
}



// Give the user a new prompt
function Reset() {
    // Show and hide elements
    document.getElementById("quizzerInput").readOnly = false;
    document.getElementById("quizzerSubmit").disabled = false;
    document.getElementById("quizzerFeedback").hidden = true;
    document.getElementById("quizzerContinue").hidden = true;
    
    // Get prompt
    Term++;
    if (Term == Terms.length) {
        ShuffleTerms();
        Term = 0;
    }
    document.getElementById("quizzerProgress").textContent = `${Term + 1} / ${Terms.length}`;

    // Set prompt
    document.getElementById("quizzerPromptType").textContent = `${Terms[Term][0]}: `;
    document.getElementById("quizzerPrompt").textContent = Terms[Term][1];
    document.getElementById("quizzerInputType").textContent = `${Terms[Term][2]}: `;

    // Reset responce
    document.getElementById("quizzerInput").value = "";
} 



// Check the user's responce
function Check() {
    // Prepare responce
    var responce = document.getElementById("quizzerInput").value.toLowerCase(); // Make responce lowercase
    responce = responce.replace("a`", "á"); // Apply accented a shortcut
    responce = responce.replace("e`", "é"); // Apply accented e shortcut
    responce = responce.replace("i`", "í"); // Apply accented i shortcut
    responce = responce.replace("n`", "ñ"); // Apply n with tilde shortcut
    responce = responce.replace("n~", "ñ"); // Apply n with tilde shortcut
    responce = responce.replace("o`", "ó"); // Apply accented o shortcut
    responce = responce.replace("u`", "ú"); // Apply accented u shortcut
    var responces = responce.split(",");    // Split string by commas
    responces.push(responce);   // Keep origional responce
    for (var i = 0; i < responces.length; i++) {
        responces[i] = responces[i].trim(); // Trim whitespace
    }

    // Check responce
    if (!responces.includes(Terms[Term][3].toLowerCase())) {
        // Responce was incorrect
        document.getElementById("quizzerFeedback").textContent = `The correct answer is ${Terms[Term][3].toLowerCase()}.`;
        
        // Show and hide elements
        document.getElementById("quizzerInput").readOnly = true;
        document.getElementById("quizzerSubmit").disabled = true;
        document.getElementById("quizzerFeedback").hidden = false;
        document.getElementById("quizzerContinue").hidden = false;
        document.getElementById("quizzerInput").focus();
    }
    else {
        // Responce was correct
        Reset();
    }
}