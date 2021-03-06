// filter-input component
describe("FilterInput", function() {
    let FilterInput;
    beforeEach(function() {
        // Create filtersInput component
        FilterInput = new filterInput();
    });

    describe("Created lifecycle hook", function() {
        it("Category should be 'verbs'", function() {
            expect(FilterInput.category).to.equal("verbs");
        });

        it("VerbFilters should be empty", function() {
            expect(FilterInput.verbFilters).to.deep.equal([]);
        });

        it("VocabFilters should be empty", function() {
            expect(FilterInput.vocabFilters).to.deep.equal([]);
        });
    });

    describe("Value computed property", function() {
        it("Should return verb filters if category is 'verbs'", function() {
            // Initialize variables
            FilterInput.category = "verbs";
            FilterInput.verbFilters = "verb-filters";
            FilterInput.vocabFilters = "vocab-filters";

            // Assert value returns verb filters
            expect(FilterInput.value, "verb-filters");
        });

        it("Should return vocab filters if category is 'vocab'", function() {
            // Initialize variables
            FilterInput.category = "vocab";
            FilterInput.verbFilters = "verb-filters";
            FilterInput.vocabFilters = "vocab-filters";

            // Assert value returns vocab filters
            expect(FilterInput.value, "vocab-filters");
        });
    });

    describe("Value watch", function() {
        it("Should emit input event", async function() {
            // Initialize variables
            FilterInput.category = "verbs";
            FilterInput.verbFilters = ["filter1"];

            // Override $emit method
            let event = "";
            let event_args;
            FilterInput.$emit = function(name, value) {
                event = name;
                event_args = value;
            };

            // Edit verb filters
            FilterInput.verbFilters.push("filter2");
            await FilterInput.$nextTick();

            // Assert event emited
            expect(event).to.equal("input");
            expect(event_args).to.have.deep.members(["filter1", "filter2"]);
        });
    });

    describe("AddFilter method", function() {
        it("Should add a verb filter if category is 'verbs'", function() {
            // Initialize variables
            FilterInput.category = "verbs";
            FilterInput.verbFilters = []
            FilterInput.vocabFilters = []
            expect(FilterInput.verbFilters.length).to.equal(0);
            expect(FilterInput.vocabFilters.length).to.equal(0);

            // Override getSettings method
            let old_getSettings = getSettings
            getSettings = function() {
                let settings = old_getSettings();
                settings.defaultFilters.verbs = {tense:"Present Tense", type:"Regular", subject:"Yo", direction:"Esp. → Conj."};
                return settings;
            };

            // Add filter
            FilterInput.AddFilter();

            // Restore getSettings method
            getSettings = old_getSettings;

            // Assert filter added
            expect(FilterInput.verbFilters).to.have.deep.members([
                {tense:"Present Tense", type:"Regular", subject:"Yo", direction:"Esp. → Conj."},
            ]);
            expect(FilterInput.vocabFilters).to.have.deep.members([]);
        });

        it("Should add a vocab filter if category is 'vocab'", function() {
            // Initialize variables
            FilterInput.category = "vocab";
            FilterInput.verbFilters = []
            FilterInput.vocabFilters = []
            expect(FilterInput.verbFilters.length).to.equal(0);
            expect(FilterInput.vocabFilters.length).to.equal(0);

            // Override getSettings method
            let old_getSettings = getSettings
            getSettings = function() {
                let settings = old_getSettings();
                settings.defaultFilters.vocab = {category:"Childhood", type:"Adjectives", direction:"Eng. → Esp."};
                return settings;
            };

            // Add filter
            FilterInput.AddFilter();

            // Restore getSettings method
            getSettings = old_getSettings;

            // Assert filter added
            expect(FilterInput.vocabFilters).to.have.deep.members([
                {category:"Childhood", type:"Adjectives", direction:"Eng. → Esp."},
            ]);
            expect(FilterInput.verbFilters).to.have.deep.members([]);
        });
    });

    describe("RemoveFilter method", function() {
        it("Should remove the specified verb filter", function() {
            // Initialize filters
            FilterInput.category = "verbs";
            FilterInput.verbFilters = [
                "verb1",
                "verb2",
                "verb3",
            ];
            FilterInput.vocabFilters = [
                "vocab1",
                "vocab2",
                "vocab3",
            ];

            // Remove filter
            FilterInput.RemoveFilter(1);

            // Assert filter removed
            expect(FilterInput.verbFilters.length).to.equal(2);
            expect(FilterInput.verbFilters[0]).to.equal("verb1");
            expect(FilterInput.verbFilters[1]).to.equal("verb3");
            expect(FilterInput.vocabFilters.length).to.equal(3);
        });

        it("Should remove the specified vocab filter", function() {
            // Initialize filters
            FilterInput.category = "vocab";
            FilterInput.verbFilters = [
                "verb1",
                "verb2",
                "verb3",
            ];
            FilterInput.vocabFilters = [
                "vocab1",
                "vocab2",
                "vocab3",
            ];

            // Remove filter
            FilterInput.RemoveFilter(1);

            // Assert filter removed
            expect(FilterInput.verbFilters.length).to.equal(3);
            expect(FilterInput.vocabFilters.length).to.equal(2);
            expect(FilterInput.vocabFilters[0]).to.equal("vocab1");
            expect(FilterInput.vocabFilters[1]).to.equal("vocab3");
        });
    });

    describe("GetTenseTypes method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"All Types", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(true);
            expect(filters["Irregular"]).to.equal(true);
        });

        it("Should be correct for Present Tense", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"Present Tense", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(false);
            expect(filters["Irregular"]).to.equal(true);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"Present Tense", type:"Orthographic"}
            ]

            // Get filters
            let filters = FilterInput.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(false);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection changed
            expect(FilterInput.verbFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"Preterite Tense", type:"Orthographic"}
            ]

            // Get filters
            let filters = FilterInput.getTenseTypes(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Reflexive"]).to.equal(true);
            expect(filters["Regular"]).to.equal(true);
            expect(filters["Nonregular"]).to.equal(true);
            expect(filters["Stem Changing"]).to.equal(true);
            expect(filters["Orthographic"]).to.equal(true);
            expect(filters["Irregular"]).to.equal(true);

            // Assert selection not changed
            expect(FilterInput.verbFilters[0]["type"]).to.equal("Orthographic");
        });
    });

    describe("GetTenseSubjects method", function() {
        it("Should be correct for All Tenses", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"All Types", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(true);
            expect(filters["Tú"]).to.equal(true);
            expect(filters["Él"]).to.equal(true);
            expect(filters["Nosotros"]).to.equal(true);
            expect(filters["Ellos"]).to.equal(true);
        });

        it("Should be correct for Present Participles", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"Present Participles", subject:"All Subjects", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(false);
            expect(filters["Tú"]).to.equal(false);
            expect(filters["Él"]).to.equal(false);
            expect(filters["Nosotros"]).to.equal(false);
            expect(filters["Ellos"]).to.equal(false);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"Present Participles", subject:"Yo", type:"All Types"}
            ]

            // Get filters
            let filters = FilterInput.getTenseSubjects(0);

            // Assert filters are correct
            expect(filters["All Subjects"]).to.equal(true);
            expect(filters["Yo"]).to.equal(false);
            expect(filters["Tú"]).to.equal(false);
            expect(filters["Él"]).to.equal(false);
            expect(filters["Nosotros"]).to.equal(false);
            expect(filters["Ellos"]).to.equal(false);

            // Assert selection changed
            expect(FilterInput.verbFilters[0]["subject"]).to.equal("All Subjects");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            FilterInput.verbFilters = [
                {tense:"Present Participles", subject:"Type", type:"All Types"},
                {tense:"Preterite Tense", subject:"Yo", type:"All Types"},
            ]

            // Get filters
            FilterInput.getTenseSubjects(0);
            FilterInput.getTenseSubjects(1);

            // Assert selection not changed
            expect(FilterInput.verbFilters[0].subject).to.equal("Type");
            expect(FilterInput.verbFilters[1].subject).to.equal("Yo");
        });
    });

    describe("GetCategoryFilters method", function() {
        it("Should be correct for Verbs", function() {
            // Initialize filters
            FilterInput.vocabFilters = [
                {category:"Verbs", type:"All Definitions"}
            ]

            // Get filters
            let filters = FilterInput.getCategoryFilters(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(false);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
        });

        it("Should be correct for sets with 1 type", function() {
            // Initialize filters
            FilterInput.vocabFilters = [
                {category:"Colors", type:"All Definitions"}
            ]

            // Get filters
            let filters = FilterInput.getCategoryFilters(0);

            // Assert filters are correct
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(true);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
        });

        it("Should change selection if not available", function() {
            // Initialize filters
            FilterInput.vocabFilters = [
                {category:"Colors", type:"Verbs"}
            ]

            // Get filters
            let filters = FilterInput.getCategoryFilters(0);

            // Assert selection changed
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(true);
            expect(filters["Nouns"]).to.equal(false);
            expect(filters["Verbs"]).to.equal(false);
            expect(FilterInput.vocabFilters[0]["type"]).to.equal("All Types");
        });

        it("Should not change selection if available", function() {
            // Initialize filters
            FilterInput.vocabFilters = [
                {category:"Professions", type:"Verbs"}
            ]

            // Get filters
            let filters = FilterInput.getCategoryFilters(0);

            // Assert selection not changed
            expect(filters["All Types"]).to.equal(true);
            expect(filters["Adjectives"]).to.equal(false);
            expect(filters["Nouns"]).to.equal(true);
            expect(filters["Verbs"]).to.equal(true);
            expect(FilterInput.vocabFilters[0]["type"]).to.equal("Verbs");
        });
    });
});



// filters-page component
describe("FiltersPage", function() {
    let FiltersPage;
    beforeEach(function() {
        // Create filtersPage component
        FiltersPage = new filtersPage();
    });

    describe("StartSession method", function() {
        it("Should push quizzer page", function() {
            // Override $router.push method
            let push_args;
            FiltersPage.$router = {push: function(args) {
                push_args = args;
            }};

            // Override $root.$data.data property
            FiltersPage.$root = {$data: {data: {vocab: [
                ["English","Spanish","Type","Category"],
                ["Hello","Hola","Type","Category"],
            ]}}};

            // Initialize variables
            FiltersPage.category = "vocab";
            FiltersPage.settings = {
                promptType: "Text",     // Required to prevent browser validation alerts
                inputType: "Text",      // Required to prevent browser validation alerts
                testSetting: "testValue",
            };
            FiltersPage.filters = [
                {category:"All Categories", type:"All Types", direction:"Eng. → Esp."}
            ];

            // Call StartSession
            FiltersPage.StartSession([1, 2, 3], 0);

            // Assert event emited
            expect(push_args).to.deep.equal({
                name: "quizzer",
                params: {
                    startingPrompts: [["English", "Hello", "Spanish", "Hola"]],
                    startingIndex: 0,
                    settings: {
                        promptType: "Text",     // Required to prevent browser validation alerts
                        inputType: "Text",      // Required to prevent browser validation alerts
                        testSetting: "testValue",
                    },
                    referer: FiltersPage.category,
                }
            });
        });
    });
});
