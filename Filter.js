class Filter
{
    // Create a new Filter
    constructor(io, value)
    {
        // Set variables
        this.IO = io;       // Format: [[<output index>, <input index>]]
        this.Value = value; // Format: [[<index>, [<values>], exclude?]]
    }


    // Apply the filter to a vocabulary set
    Apply(vocabSet)
    {
        // Filter terms by value
        var vSet = vocabSet.slice(1);  // Format: same as vocabSet but without headers
        for (var i = 0; i < this.Value.length; i++)
        {
            for (var j = 0; j < vSet.length; j++)
            {
                if (this.Value[i][2])
                {
                    // Exclude values
                    if (this.Value[i][1].includes(vSet[j][this.Value[i][0]]))
                    {
                        vSet.splice(j, 1);  // Remove item
                        j--;    // Adjust for the removal of an item
                    }
                }
                else
                {
                    // Include values
                    if (!this.Value[i][1].includes(vSet[j][this.Value[i][0]]))
                    {
                        vSet.splice(j, 1);  // Remove item
                        j--;    // Adjust for the removal of an item
                    }
                }
            }
        }

        // Filter terms by input/output
        var ioSet = []; // Format: [<output type>, <output>, <input type>, <input>]
        for (var i = 0; i < this.IO.length; i++)
        {
            for (var j = 0; j < vSet.length; j++)
            {
                ioSet.push([vocabSet[0][this.IO[i][0]], vSet[j][this.IO[i][0]], vocabSet[0][this.IO[i][1]], vSet[j][this.IO[i][1]]]);
            }
        }

        // Return filtered set
        return ioSet;
    }



    // Get a common filter
    static GetFilter(name)
    {
        switch (name)
        {
            case "None":
                return new Filter([], []);

            case "All Definitions":
                return new Filter([[0,1], [1,0]], []);

            case "English to Spanish":
                return new Filter([[0,1]], []);

            case "Spanish to English":
                return new Filter([[1,0]], []);
            
            case "All Conjugations":
                return new Filter([[0,2], [0,4], [0,5], [0,6], [0,7], [0,8], [0,10], [0,11], [0,12], [0,13], [0,14], [0,16], [0,17], [0,18], [0,19], [0,20]], []);
            
            case "Reverse Conjugations":
                return new Filter([[2,0], [4,0], [5,0], [6,0], [7,0], [8,0], [10,0], [11,0], [12,0], [13,0], [14,0], [16,0], [17,0], [18,0], [19,0], [20,0]], []);

            case "Present Participles":
                return new Filter([[0,2]], []);

            case "Present Tense":
                return new Filter([[0,4], [0,5], [0,6], [0,7], [0,8]], []);

            case "Preterite Tense":
                return new Filter([[0,10], [0,11], [0,12], [0,13], [0,14]], []);

            case "Imperfect Tense":
                return new Filter([[0,16], [0,17], [0,18], [0,19], [0,20]], []);

            case "Nouns":
                return new Filter([[0,1], [1,0]], [[2, ["Noun"], false]]);

            case "Verbs":
                return new Filter([[0,1], [1,0]], [[2, ["Verb"], false]]);

            case "Adjectives":
                return new Filter([[0,1], [1,0]], [[2, ["Adjective"], false]]);

            default:
                return new Filter([], []);
        }
    }
}