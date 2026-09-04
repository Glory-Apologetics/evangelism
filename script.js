/* =========================================================
   YOU FOUND JESUS
   COMPLETE SCRIPT
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

const CONFIG = {

    /*
     * Put your background music here:
     *
     * your-project/
     * ├── index.html
     * ├── style.css
     * ├── script.js
     * └── audio/
     *     └── cinematic-bg.mp3
     */

    backgroundMusic: "audio/cinematic-bg.mp3",

    /*
     * Replace this with your YouTube video ID.
     *
     * Example:
     * https://www.youtube.com/watch?v=ABC123XYZ
     *
     * Video ID = ABC123XYZ
     */

    youtubeVideoId: "l4usl7ymlZs",

    /*
     * Optional Apps Script / prayer endpoint.
     *
     * Leave blank if you do not want to send
     * prayer requests to a backend.
     */

    prayerEndpoint: "https://script.google.com/macros/s/AKfycbxru7NOEEtZO9pF6Dmdss-vEyTt7bd7SWl3ERHiaoER_mqp-zEqE3g_yi4I6Dy8nIK8xA/exec"
};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let soundEnabled = true;

let audioContext = null;
let masterGain = null;

let backgroundMusic = null;
let musicSourceReady = false;

let currentCategory = null;
let currentSelectedVerse = null;
let currentGospel = 0;
let currentResponseStep = 0;

let revealTimer = null;
let gospelTransitionTimer = null;
let journeyTransitionTimer = null;
let journeyAnimating = false;

let movieWasOpened = false;


/* =========================================================
   CATEGORY DATA
   ========================================================= */

const CATEGORIES = {

    "love": {
        icon: "❤️",
        label: "LOVE",
        subtitle: "To know you are loved",

        promise:
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",

        reference:
            "JOHN 3:16",

        verses: [
            {
                reference: "JOHN 3:16",
                text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
            },
            {
                reference: "ROMANS 5:8",
                text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us."
            },
            {
                reference: "JOHN 15:9",
                text: "As the Father has loved me, so have I loved you. Now remain in my love."
            },
            {
                reference: "JOHN 15:13",
                text: "Greater love has no one than this, that he lay down his life for his friends."
            },
            {
                reference: "1 JOHN 4:10",
                text: "This is love: not that we loved God, but that he loved us and sent his Son as an atoning sacrifice for our sins."
            },
            {
                reference: "JEREMIAH 31:3",
                text: "The Lord appeared to us in the past, saying: \"I have loved you with an everlasting love; I have drawn you with loving-kindness."
            },
            {
                reference: "1 JOHN 3:1",
                text: "How great is the love the Father has lavished on us, that we should be called children of God! And that is what we are! The reason the world does not know us is that it did not know him."
            },
            {
                reference: "PSALM 117:2",
                text: "For great is his love toward us, and the faithfulness of the Lord endures forever. Praise the Lord."
            },
            {
                reference: "PSALM 118:1",
                text: "Give thanks to the Lord, for he is good; his love endures forever."
            },
            {
                reference: "PSALM 31:7",
                text: "I will be glad and rejoice in your love, for you saw my affliction and knew the anguish of my soul."
            }
        ],

        lastVerseIndex: -1,

        message:
            "You are not invisible to God. His love is personal, intentional, and reaching toward you."
    },

    "peace": {
        icon: "🕊️",
        label: "PEACE",
        subtitle: "For a restless heart",

        promise:
            "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",

        reference:
            "JOHN 14:27",

        verses: [
            {
                reference: "JOHN 14:27",
                text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid."
            },
            {
                reference: "JOHN 16:33",
                text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.\""
            },
            {
                reference: "ISAIAH 26:3",
                text: "You will keep in perfect peace him whose mind is steadfast, because he trusts in you."
            },
            {
                reference: "PSALM 4:8",
                text: "I will lie down and sleep in peace, for you alone, O Lord, make me dwell in safety."
            },
            {
                reference: "2 THESSALONIANS 3:16",
                text: "Now may the Lord of peace himself give you peace at all times and in every way. The Lord be with all of you."
            },
            {
                reference: "PSALM 55:22",
                text: "Cast your cares on the Lord and he will sustain you; he will never let the righteous fall."
            },
            {
                reference: "COLOSSIANS 3:15",
                text: "Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful."
            },
            {
                reference: "ROMANS 5:1",
                text: "Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ,"
            },
            {
                reference: "PSALM 119:165",
                text: "Great peace have they who love your law, and nothing can make them stumble."
            },
            {
                reference: "PSALM 29:11",
                text: "The Lord gives strength to his people; the Lord blesses his people with peace."
            }
        ],

        lastVerseIndex: -1,

        message:
            "Jesus offers a peace that does not depend on circumstances. Bring your fears and worries to Him."
    },

    "forgiveness": {
        icon: "🤍",
        label: "FORGIVENESS",
        subtitle: "To begin again",

        promise:
            "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.",

        reference:
            "1 JOHN 1:9",

        verses: [
            {
                reference: "1 JOHN 1:9",
                text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness."
            },
            {
                reference: "EPHESIANS 1:7",
                text: "In him we have redemption through his blood, the forgiveness of sins, in accordance with the riches of God's grace"
            },
            {
                reference: "ACTS 10:43",
                text: "All the prophets testify about him that everyone who believes in him receives forgiveness of sins through his name.\""
            },
            {
                reference: "ROMANS 8:1",
                text: "Therefore, there is now no condemnation for those who are in Christ Jesus,"
            },
            {
                reference: "PSALM 32:1",
                text: "Blessed is he whose transgressions are forgiven, whose sins are covered."
            },
            {
                reference: "PSALM 32:5",
                text: "Then I acknowledged my sin to you and did not cover up my iniquity. I said, “I will confess my transgressions to the Lord”—and you forgave the guilt of my sin."
            },
            {
                reference: "PSALM 103:12",
                text: "As far as the east is from the west, so far has he removed our transgressions from us."
            },
            {
                reference: "MICAH 7:18",
                text: "Who is a God like you, who pardons sin and forgives the transgression of the remnant of his inheritance? You do not stay angry forever but delight to show mercy."
            },
            {
                reference: "ISAIAH 1:18",
                text: "“Come now, let us reason together,” says the Lord. “Though your sins are like scarlet, they shall be as white as snow; though they are red as crimson, they shall be like wool.”"
            },
            {
                reference: "COLOSSIANS 2:13",
                text: "When you were dead in your sins and in the uncircumcision of your sinful nature, God made you alive with Christ. He forgave us all our sins,"
            }
        ],

        lastVerseIndex: -1,

        message:
            "Your past does not have to define your future. In Jesus, forgiveness and a new beginning are possible."
    },

    "rest": {
        icon: "🛌",
        label: "REST",
        subtitle: "When you feel exhausted",

        promise:
            "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.\"",

        reference:
            "MATTHEW 11:28-30",

        verses: [
            {
                reference: "MATTHEW 11:28",
                text: "Come to me, all you who are weary and burdened, and I will give you rest."
            },
            {
                reference: "1 PETER 5:7",
                text: "Cast all your anxiety on him because he cares for you."
            },
            {
                reference: "PSALM 55:22",
                text: "Cast your cares on the Lord and he will sustain you; he will never let the righteous fall."
            },
            {
                reference: "PSALM 46:10",
                text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.\""
            },
            {
                reference: "EXODUS 33:14",
                text: "The Lord replied, \"My Presence will go with you, and I will give you rest.\""
            },
            {
                reference: "PSALM 23:1",
                text: "The Lord is my shepherd, I shall not be in want."
            },
            {
                reference: "PSALM 62:1",
                text: "My soul finds rest in God alone; my salvation comes from him."
            },
            {
                reference: "ISAIAH 40:29",
                text: "He gives strength to the weary and increases the power of the weak."
            },
            {
                reference: "PSALM 116:7",
                text: "Be at rest once more, O my soul, for the Lord has been good to you."
            },
            {
                reference: "MARK 6:31",
                text: "Then, because so many people were coming and going that they did not even have a chance to eat, he said to them, \"Come with me by yourselves to a quiet place and get some rest.\""
            }
        ],

        lastVerseIndex: -1,

        message:
            "Jesus does not ask you to carry everything alone. Come to Him with what is weighing you down."
    },

    "courage": {
        icon: "💪",
        label: "COURAGE",
        subtitle: "When you feel afraid",

        promise:
            "Have I not commanded you? Be strong and courageous. Do not be terrified; do not be discouraged, for the Lord your God will be with you wherever you go.\"",

        reference:
            "JOSHUA 1:9",

        verses: [
            {
                reference: "JOSHUA 1:9",
                text: "Have I not commanded you? Be strong and courageous. Do not be terrified; do not be discouraged, for the Lord your God will be with you wherever you go.\""
            },
            {
                reference: "DEUTERONOMY 31:8",
                text: "The Lord himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.\""
            },
            {
                reference: "PSALM 56:3-4",
                text: "When I am afraid, I will trust in you. In God, whose word I praise, in God I trust; I will not be afraid. What can mortal man do to me?"
            },
            {
                reference: "ISAIAH 41:10",
                text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand."
            },
            {
                reference: "2 TIMOTHY 1:7",
                text: "For God did not give us a spirit of timidity, but a spirit of power, of love and of self-discipline."
            },
            {
                reference: "PSALM 27:1",
                text: "The Lord is my light and my salvation- whom shall I fear? The Lord is the stronghold of my life- of whom shall I be afraid?"
            },
            {
                reference: "PSALM 118:6",
                text: "The Lord is with me; I will not be afraid. What can man do to me?"
            },
            {
                reference: "PSALM 31:24",
                text: "Be strong and take heart, all you who hope in the Lord."
            },
            {
                reference: "PSALM 34:4",
                text: "I sought the Lord, and he answered me; he delivered me from all my fears."
            },
            {
                reference: "JOHN 16:33",
                text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.\""
            }
        ],

        lastVerseIndex: -1,

        message:
            "Fear does not have to control your next step. God invites you to trust Him with courage."
    },

    "hope": {
        icon: "🌅",
        label: "HOPE",
        subtitle: "When tomorrow feels dark",

        promise:
            "Not only so, but we also rejoice in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope. And hope does not disappoint us, because God has poured out his love into our hearts by the Holy Spirit, whom he has given us.",

        reference:
            "ROMANS 5:3-5",

        verses: [
            {
                reference: "ROMANS 15:13",
                text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit."
            },
            {
                reference: "HEBREWS 6:19",
                text: "We have this hope as an anchor for the soul, firm and secure. It enters the inner sanctuary behind the curtain,"
            },
            {
                reference: "PSALM 42:5",
                text: "Why are you downcast, O my soul? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God."
            },
            {
                reference: "ROMANS 8:18",
                text: "I consider that our present sufferings are not worth comparing with the glory that will be revealed in us."
            },
            {
                reference: "JOHN 11:25-26",
                text: "Jesus said to her, \"I am the resurrection and the life. He who believes in me will live, even though he dies; and whoever lives and believes in me will never die. Do you believe this?\""
            },
            {
                reference: "PSALM 71:5",
                text: "For you have been my hope, O Sovereign Lord, my confidence since my youth."
            },
            {
                reference: "PSALM 130:5",
                text: "I wait for the Lord, my soul waits, and in his word I put my hope."
            },
            {
                reference: "ROMANS 8:24-25",
                text: "For in this hope we were saved. But hope that is seen is no hope at all. Who hopes for what he already has? But if we hope for what we do not yet have, we wait for it patiently."
            },
            {
                reference: "HEBREWS 10:23",
                text: "Let us hold unswervingly to the hope we profess, for he who promised is faithful."
            },
            {
                reference: "PSALM 119:114",
                text: "You are my refuge and my shield; I have put my hope in your word."
            }
        ],

        lastVerseIndex: -1,

        message:
            "Even when you cannot see what comes next, God is not absent. Hope can begin again."
    },

    "purpose": {
        icon: "🧭",
        label: "PURPOSE",
        subtitle: "To discover your why",

        promise:
            "For we are God's workmanship, created in Christ Jesus to do good works, which God prepared in advance for us to do.",

        reference:
            "EPHESIANS 2:10",

        verses: [
            {
                reference: "EPHESIANS 2:10",
                text: "For we are God's workmanship, created in Christ Jesus to do good works, which God prepared in advance for us to do."
            },
            {
                reference: "COLOSSIANS 1:16",
                text: "For by him all things were created: things in heaven and on earth, visible and invisible, whether thrones or powers or rulers or authorities; all things were created by him and for him."
            },
            {
                reference: "JOHN 15:5",
                text: "I am the vine; you are the branches. If a man remains in me and I in him, he will bear much fruit; apart from me you can do nothing."
            },
            {
                reference: "JOHN 15:16",
                text: "You did not choose me, but I chose you and appointed you to go and bear fruit--fruit that will last. Then the Father will give you whatever you ask in my name."
            },
            {
                reference: "1 CORINTHIANS 10:31",
                text: "So whether you eat or drink or whatever you do, do it all for the glory of God."
            },
            {
                reference: "MICAH 6:8",
                text: "He has showed you, O man, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God."
            },
            {
                reference: "1 PETER 4:10",
                text: "Each one should use whatever gift he has received to serve others, faithfully administering God's grace in its various forms."
            },
            {
                reference: "PHILIPPIANS 2:13",
                text: "for it is God who works in you to will and to act according to his good purpose."
            },
            {
                reference: "ROMANS 8:28",
                text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
            },
            {
                reference: "JEREMIAH 29:11",
                text: "“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”"
            }
        ],

        lastVerseIndex: -1,

        message:
            "Your life is not an accident. God created you with purpose and invites you to discover it in Him."
    },

    "eternal-life": {
        icon: "♾️",
        label: "ETERNAL LIFE",
        subtitle: "What happens beyond today",

        promise:
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",

        reference:
            "JOHN 3:16",

        verses: [
            {
                reference: "JOHN 3:16",
                text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
            },
            {
                reference: "JOHN 3:36",
                text: "Whoever believes in the Son has eternal life, but whoever rejects the Son will not see life, for God's wrath remains on him.\""
            },
            {
                reference: "JOHN 5:24",
                text: "I tell you the truth, whoever hears my word and believes him who sent me has eternal life and will not be condemned; he has crossed over from death to life."
            },
            {
                reference: "JOHN 6:40",
                text: "For my Father's will is that everyone who looks to the Son and believes in him shall have eternal life, and I will raise him up at the last day.\""
            },
            {
                reference: "JOHN 10:27-28",
                text: "My sheep listen to my voice; I know them, and they follow me. I give them eternal life, and they shall never perish; no one can snatch them out of my hand."
            },
            {
                reference: "JOHN 11:25-26",
                text: "Jesus said to her, \"I am the resurrection and the life. He who believes in me will live, even though he dies; and whoever lives and believes in me will never die. Do you believe this?\""
            },
            {
                reference: "ROMANS 6:23",
                text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord."
            },
            {
                reference: "1 JOHN 5:11-12",
                text: "And this is the testimony: God has given us eternal life, and this life is in his Son. He who has the Son has life; he who does not have the Son of God does not have life."
            },
            {
                reference: "JOHN 17:3",
                text: "Now this is eternal life: that they may know you, the only true God, and Jesus Christ, whom you have sent."
            },
            {
                reference: "JOHN 14:19",
                text: "Because I live, you also will live."
            }
        ],

        lastVerseIndex: -1,

        message:
            "Jesus offers more than help for today. He offers reconciliation with God and the hope of eternal life."
    }
};


/* =========================================================
   GOSPEL DATA
   ========================================================= */

const GOSPEL = [

    {
        number: "01",
        icon: "❤️",

        heading:
            "GOD MADE YOU — AND LOVES YOU",

        text:
            "You were created by God for relationship with Him. His love is not distant or abstract — He calls you to know Him."
    },

    {
        number: "02",
        icon: "⚡",

        heading:
            "SIN HAS BROKEN THAT RELATIONSHIP",

        text:
            "We have all sinned. Sin is not merely a mistake; it is rebellion against God, and it separates us from Him. Scripture says, “all have sinned” (Romans 3:23)."
    },

    {
        number: "03",
        icon: "✝️",

        heading:
            "JESUS DIED AND ROSE FOR YOU",

        text:
            "God did not leave us in our sin. Jesus, the Son of God, took our sin upon Himself, died on the cross, and rose again. His resurrection means sin and death do not have the final word."
    },

    {
        number: "04",
        icon: "🎁",

        heading:
            "SALVATION IS GRACE — NOT ACHIEVEMENT",

        text:
            "You cannot earn forgiveness by being good enough. God offers salvation as a gift of grace. Turn from sin, trust in Jesus, and receive His forgiveness by faith — not by your own works."
    },

    {
        number: "05",
        icon: "👣",

        heading:
            "SO WHAT WILL YOU DO WITH JESUS?",

        text:
            "The Gospel calls for a response: repent of your sin, believe in Jesus, receive His forgiveness, and begin following Him. The invitation is personal."
    }

];


/* =========================================================
   RESPONSE JOURNEY DATA
   ========================================================= */

const RESPONSE_JOURNEY = [

    {
        icon: "⏸️",

        heading:
            "PAUSE.",

        subtitle:
            "LET IT SINK IN.",

        text:
            "You have just heard the heart of the Gospel. Before rushing to the next thing, stop for a moment and consider what Jesus is inviting you to receive.",

        quote:
            "“Here I am! I stand at the door and knock.” — Revelation 3:20"
    },

    {
        icon: "↗️",

        heading:
            "TURN",

        subtitle:
            "TOWARD JESUS.",

        text:
            "Following Jesus begins with turning toward Him. That means acknowledging your sin, turning away from it, and trusting Him rather than trying to save yourself.",

        bullets: [
            "Acknowledge your need for God.",
            "Turn away from sin.",
            "Trust Jesus instead of yourself."
        ]
    },

    {
        icon: "🙏",

        heading:
            "TALK",

        subtitle:
            "TO JESUS.",

        text:
            "You do not need perfect words. You can speak honestly to Jesus right now.",

        prayer:
            "Lord Jesus, I know that I have sinned and I cannot save myself. I am sorry for my sin. I turn to You. I believe that You died for my sins and rose again. Please forgive me, make me new, and lead my life. I place my trust in You. Help me follow You from this day forward. Amen."
    },

    {
        icon: "🌅",

        heading:
            "BEGIN",

        subtitle:
            "A NEW LIFE.",

        text:
            "Following Jesus is not about becoming perfect overnight. It is about beginning a new life with Him — learning His Word, praying, joining His people, and continuing to trust and follow Him.",

        bullets: [
            "Read the Bible and learn who Jesus is.",
            "Talk to God through prayer.",
            "Find a healthy local Christian church.",
            "Keep taking your next step with Jesus."
        ]
    }

];


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeUniverse();

    initializeSound();

    initializeNavigation();

    initializeCategories();

    initializeGospel();

    initializeJourney();

    initializePrayer();

    initializeMovie();

    initializeBackButtons();

    /*
     * Try to prepare music immediately.
     * Actual playback may still be blocked by browser
     * autoplay policy until the first user gesture.
     */

    initBackgroundMusic();

    startBackgroundMusic();

});


/* =========================================================
   UNIVERSE
   ========================================================= */

function initializeUniverse() {

    createStars();

    createDust();

    createHearts();

}


function createStars() {

    const container = $("#stars");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const count =
        window.innerWidth < 600
            ? 85
            : 140;

    for (let i = 0; i < count; i++) {

        const star = document.createElement("span");

        star.className = "star";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        star.style.setProperty(
            "--duration",
            `${2 + Math.random() * 4}s`
        );

        star.style.animationDelay =
            `${Math.random() * 5}s`;

        const size =
            Math.random() < .82
                ? 1
                : 2;

        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        container.appendChild(star);
    }
}


function createDust() {

    const container = $("#dust");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const count =
        window.innerWidth < 600
            ? 25
            : 45;

    for (let i = 0; i < count; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "dust-particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;

        particle.style.setProperty(
            "--duration",
            `${8 + Math.random() * 13}s`
        );

        particle.style.setProperty(
            "--drift",
            `${-80 + Math.random() * 160}px`
        );

        particle.style.animationDelay =
            `${-Math.random() * 15}s`;

        container.appendChild(particle);
    }
}


function createHearts() {

    const container = $("#hearts");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const count =
        window.innerWidth < 600
            ? 12
            : 20;

    const homeOnlyCount =
        window.innerWidth < 600
            ? 5
            : 9;

    for (let i = 0; i < count + homeOnlyCount; i++) {

        const heart =
            document.createElement("span");

        heart.className =
            i >= count
                ? "floating-heart home-heart"
                : "floating-heart";

        heart.textContent = "♥";

        heart.style.left =
            `${Math.random() * 100}%`;

        heart.style.setProperty(
            "--size",
            `${7 + Math.random() * 13}px`
        );

        heart.style.setProperty(
            "--duration",
            `${9 + Math.random() * 12}s`
        );

        heart.style.setProperty(
            "--drift",
            `${-100 + Math.random() * 200}px`
        );

        heart.style.animationDelay =
            `${-Math.random() * 18}s`;

        container.appendChild(heart);
    }
}


/* =========================================================
   SOUND SYSTEM
   ========================================================= */

function initializeSound() {

    const toggle =
        $("#soundToggle");

    if (!toggle) {
        return;
    }

    soundEnabled = true;

    toggle.textContent = "🔊";

    toggle.addEventListener("click", async (event) => {

        event.stopPropagation();

        if (!soundEnabled) {

            soundEnabled = true;

            toggle.textContent = "🔊";

            await enableSoundFromGesture();

            clickSound();

        } else {

            soundEnabled = false;

            toggle.textContent = "🔇";

            stopBackgroundMusic();

        }

    });


    /*
     * Browser audio policy:
     * the first pointer interaction is used to unlock
     * the AudioContext and start the cinematic ambience.
     */

    document.addEventListener(
        "pointerdown",
        () => {

            if (!soundEnabled) {
                return;
            }

            enableSoundFromGesture();

        },
        {
            once: false,
            passive: true
        }
    );

}


function enableSoundFromGesture() {

    try {

        /*
         * IMPORTANT: start the HTML audio element immediately while
         * we are still inside the user's pointer/click gesture.
         * Waiting for AudioContext.resume() first can lose the browser's
         * transient user-activation permission and cause play() to fail.
         */
        initBackgroundMusic();
        startBackgroundMusic();

        /*
         * The Web Audio context is used by the UI sound effects.
         * Resume it after requesting the background music.
         */
        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

            masterGain =
                audioContext.createGain();

            masterGain.gain.value =
                0.8;

            masterGain.connect(
                audioContext.destination
            );
        }

        if (
            audioContext.state ===
            "suspended"
        ) {
            audioContext.resume().catch((error) => {
                console.warn(
                    "AudioContext could not be resumed:",
                    error
                );
            });
        }

    } catch (error) {

        console.warn(
            "Audio could not be initialized:",
            error
        );

    }
}


/* =========================================================
   BACKGROUND MUSIC
   ========================================================= */

function initBackgroundMusic() {

    if (backgroundMusic) {
        return;
    }

    try {

        backgroundMusic =
            new Audio(
                CONFIG.backgroundMusic
            );

        backgroundMusic.loop = true;

        /*
         * Latest requested background volume.
         */

        backgroundMusic.volume = 0.30;

        backgroundMusic.preload = "auto";

        backgroundMusic.setAttribute(
            "playsinline",
            ""
        );

        backgroundMusic.addEventListener(
            "error",
            () => {

                console.warn(
                    "Background music could not be loaded. Check audio/cinematic-bg.mp3"
                );

            }
        );

        musicSourceReady = true;

    } catch (error) {

        console.warn(
            "Could not initialize background music:",
            error
        );

    }
}


function startBackgroundMusic() {

    if (
        !soundEnabled ||
        !backgroundMusic ||
        !musicSourceReady
    ) {
        return;
    }

    backgroundMusic.volume = 0.30;

    const promise =
        backgroundMusic.play();

    if (
        promise &&
        typeof promise.catch === "function"
    ) {

        promise.catch(() => {

            /*
             * Browser may reject autoplay.
             * First user gesture will retry.
             */

        });

    }
}


function stopBackgroundMusic() {

    if (!backgroundMusic) {
        return;
    }

    try {

        backgroundMusic.pause();

        /*
         * Keep position so that returning to the experience
         * resumes naturally.
         */

    } catch (error) {

        console.warn(error);

    }
}


/* =========================================================
   SOUND EFFECTS
   ========================================================= */

function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        masterGain =
            audioContext.createGain();

        masterGain.gain.value =
            0.8;

        masterGain.connect(
            audioContext.destination
        );
    }

    return audioContext;
}


function createEnvelope(
    gain,
    start,
    attack,
    decay,
    peak,
    end
) {

    gain.gain.cancelScheduledValues(start);

    gain.gain.setValueAtTime(
        0.0001,
        start
    );

    gain.gain.exponentialRampToValueAtTime(
        peak,
        start + attack
    );

    gain.gain.exponentialRampToValueAtTime(
        end,
        start + attack + decay
    );
}


/* ---------------------------------------------------------
   CLICK
   --------------------------------------------------------- */

function clickSound() {

    if (!soundEnabled) {
        return;
    }

    try {

        const ctx =
            getAudioContext();

        const now =
            ctx.currentTime;

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        osc.type = "sine";

        osc.frequency.setValueAtTime(
            780,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            1120,
            now + .07
        );

        createEnvelope(
            gain,
            now,
            .006,
            .12,
            .14,
            .0001
        );

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + .16);

        /*
         * Tiny upper glass harmonic.
         */

        const harmonic =
            ctx.createOscillator();

        const harmonicGain =
            ctx.createGain();

        harmonic.type = "sine";

        harmonic.frequency.setValueAtTime(
            1560,
            now
        );

        createEnvelope(
            harmonicGain,
            now,
            .004,
            .09,
            .045,
            .0001
        );

        harmonic.connect(harmonicGain);
        harmonicGain.connect(masterGain);

        harmonic.start(now);
        harmonic.stop(now + .12);

    } catch (error) {

        console.warn(error);

    }
}


/* ---------------------------------------------------------
   SOFT POP
   --------------------------------------------------------- */

function softPop() {

    if (!soundEnabled) {
        return;
    }

    try {

        const ctx =
            getAudioContext();

        const now =
            ctx.currentTime;

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        osc.type = "sine";

        osc.frequency.setValueAtTime(
            180,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            75,
            now + .22
        );

        createEnvelope(
            gain,
            now,
            .008,
            .24,
            .22,
            .0001
        );

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + .27);

    } catch (error) {

        console.warn(error);

    }
}


/* ---------------------------------------------------------
   CINEMATIC WHOOSH
   --------------------------------------------------------- */

function swoosh() {

    if (!soundEnabled) {
        return;
    }

    try {

        const ctx =
            getAudioContext();

        const now =
            ctx.currentTime;

        /*
         * Filtered noise layer.
         */

        const bufferSize =
            ctx.sampleRate * .8;

        const buffer =
            ctx.createBuffer(
                1,
                bufferSize,
                ctx.sampleRate
            );

        const data =
            buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {

            data[i] =
                (Math.random() * 2 - 1) *
                (1 - i / bufferSize);

        }

        const noise =
            ctx.createBufferSource();

        noise.buffer = buffer;

        const filter =
            ctx.createBiquadFilter();

        filter.type =
            "bandpass";

        filter.frequency.setValueAtTime(
            450,
            now
        );

        filter.frequency.exponentialRampToValueAtTime(
            2600,
            now + .42
        );

        filter.Q.value = .65;

        const gain =
            ctx.createGain();

        gain.gain.setValueAtTime(
            .0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            .17,
            now + .12
        );

        gain.gain.exponentialRampToValueAtTime(
            .0001,
            now + .78
        );

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start(now);
        noise.stop(now + .8);


        /*
         * Rising cinematic tonal sweep.
         */

        const osc =
            ctx.createOscillator();

        const oscGain =
            ctx.createGain();

        osc.type =
            "sine";

        osc.frequency.setValueAtTime(
            110,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            720,
            now + .72
        );

        oscGain.gain.setValueAtTime(
            .0001,
            now
        );

        oscGain.gain.exponentialRampToValueAtTime(
            .055,
            now + .25
        );

        oscGain.gain.exponentialRampToValueAtTime(
            .0001,
            now + .82
        );

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + .84);

    } catch (error) {

        console.warn(error);

    }
}


/* ---------------------------------------------------------
   CINEMATIC IMPACT
   --------------------------------------------------------- */

function cinematicImpact() {

    if (!soundEnabled) {
        return;
    }

    try {

        const ctx =
            getAudioContext();

        const now =
            ctx.currentTime;

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        osc.type =
            "sine";

        osc.frequency.setValueAtTime(
            105,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            42,
            now + .65
        );

        gain.gain.setValueAtTime(
            .0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            .25,
            now + .025
        );

        gain.gain.exponentialRampToValueAtTime(
            .0001,
            now + .7
        );

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + .75);


        /*
         * Higher harmonic for a luxurious impact.
         */

        const high =
            ctx.createOscillator();

        const highGain =
            ctx.createGain();

        high.type =
            "sine";

        high.frequency.setValueAtTime(
            430,
            now
        );

        high.frequency.exponentialRampToValueAtTime(
            180,
            now + .5
        );

        highGain.gain.setValueAtTime(
            .0001,
            now
        );

        highGain.gain.exponentialRampToValueAtTime(
            .055,
            now + .02
        );

        highGain.gain.exponentialRampToValueAtTime(
            .0001,
            now + .55
        );

        high.connect(highGain);
        highGain.connect(masterGain);

        high.start(now);
        high.stop(now + .6);

    } catch (error) {

        console.warn(error);

    }
}


/* ---------------------------------------------------------
   HEAVENLY CHIME
   --------------------------------------------------------- */

function heavenlyChime() {

    if (!soundEnabled) {
        return;
    }

    try {

        const ctx =
            getAudioContext();

        const now =
            ctx.currentTime;

        const notes = [
            {
                frequency: 523.25,
                delay: 0
            },
            {
                frequency: 659.25,
                delay: .09
            },
            {
                frequency: 783.99,
                delay: .18
            },
            {
                frequency: 1046.5,
                delay: .31
            }
        ];

        notes.forEach(note => {

            const osc =
                ctx.createOscillator();

            const gain =
                ctx.createGain();

            osc.type =
                "sine";

            const start =
                now + note.delay;

            osc.frequency.setValueAtTime(
                note.frequency,
                start
            );

            gain.gain.setValueAtTime(
                .0001,
                start
            );

            gain.gain.exponentialRampToValueAtTime(
                .08,
                start + .025
            );

            gain.gain.exponentialRampToValueAtTime(
                .0001,
                start + 1.35
            );

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(start);
            osc.stop(start + 1.4);

        });

    } catch (error) {

        console.warn(error);

    }
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const begin = $("#beginBtn");

    if (begin) {

        begin.onclick = () => {

            enableSoundFromGesture();

            clickSound();

            setTimeout(() => {
                swoosh();
            }, 80);

            setTimeout(() => {
                showScreen("category");
            }, 420);

        };

    }


    const discover = $("#discoverMore");

    if (discover) {

        discover.onclick = () => {

            clickSound();

            showScreen("discover");

        };

    }

}

function showScreen(name) {

    const screens = {

        welcome: "welcomeScreen",
        category: "categoryScreen",
        reveal: "revealScreen",
        promise: "promiseScreen",
        discover: "discoverScreen",
        movie: "movieScreen",
        prayer: "prayerScreen",
        gospel: "gospelScreen"

    };

    Object.keys(screens).forEach(key => {

        const screen =
            document.getElementById(
                screens[key]
            );

        if (!screen) {
            return;
        }

        screen.classList.toggle(
            "active",
            key === name
        );

    });


    /*
     * Movie audio should not continue underneath
     * the rest of the experience.
     */

    if (name === "movie") {

        stopBackgroundMusic();

    } else if (
        soundEnabled
    ) {

        startBackgroundMusic();

    }


    /*
     * Clear the YouTube iframe when leaving movie.
     * This prevents video/audio continuing invisibly.
     */

    if (
        name !== "movie"
    ) {

        const frame =
            $("#movieFrame");

        if (frame) {

            frame.src = "";

        }

    }

}


/* =========================================================
   CATEGORIES
   ========================================================= */

function initializeCategories() {

    $$(".category-card").forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const category =
                    card.dataset.category;

                if (
                    !CATEGORIES[category]
                ) {
                    return;
                }

                clickSound();

                currentCategory =
                    category;

                beginReveal(
                    category
                );

            }
        );

    });

}


/* =========================================================
   REVEAL
   ========================================================= */

function beginReveal(category) {

    const data =
        CATEGORIES[category];

    if (!data) {
        return;
    }


    const screen =
        $("#revealScreen");

    if (!screen) {
        return;
    }


    clearTimeout(revealTimer);


    screen.classList.remove(
        "reveal-reset"
    );


    /*
     * Force browser to recognize a new animation cycle.
     */

    void screen.offsetWidth;


    createRevealParticles();


    $("#revealIcon").textContent =
        data.icon;

    $("#revealWord").textContent =
        data.label;


    showScreen("reveal");


    screen.classList.add(
        "reveal-reset"
    );


    swoosh();


    revealTimer =
        setTimeout(
            () => {
                revealRise();
            },
            700
        );


    setTimeout(
        () => {
            cinematicImpact();
        },
        1500
    );


    setTimeout(
        () => {
            heavenlyChime();
        },
        2150
    );


    setTimeout(
        () => {
            showPromise(category);
        },
        4300
    );

}


function revealRise() {

    if (!soundEnabled) {
        return;
    }

    try {

        const ctx =
            getAudioContext();

        const now =
            ctx.currentTime;

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        osc.type =
            "sine";

        osc.frequency.setValueAtTime(
            170,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            850,
            now + 1.1
        );

        gain.gain.setValueAtTime(
            .0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            .045,
            now + .4
        );

        gain.gain.exponentialRampToValueAtTime(
            .0001,
            now + 1.15
        );

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 1.2);

    } catch (error) {

        console.warn(error);

    }

}


function createRevealParticles() {

    const container =
        $("#revealParticles");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const count =
        window.innerWidth < 600
            ? 28
            : 42;

    const colors = [
        "#ffe6a0",
        "#ffffff",
        "#9fd8ff",
        "#f5c95b"
    ];

    for (let i = 0; i < count; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "reveal-particle";

        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            180 +
            Math.random() *
            Math.max(
                220,
                window.innerWidth * .35
            );

        const x =
            Math.cos(angle) *
            distance;

        const y =
            Math.sin(angle) *
            distance;

        particle.style.setProperty(
            "--particle-x",
            `${x}px`
        );

        particle.style.setProperty(
            "--particle-y",
            `${y}px`
        );

        particle.style.setProperty(
            "--particle-size",
            `${2 + Math.random() * 4}px`
        );

        particle.style.setProperty(
            "--particle-duration",
            `${1.3 + Math.random() * 1.7}s`
        );

        particle.style.setProperty(
            "--particle-delay",
            `${Math.random() * .8}s`
        );

        particle.style.setProperty(
            "--particle-color",
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ]
        );

        container.appendChild(
            particle
        );

    }

}


/* =========================================================
   PROMISE
   ========================================================= */

function fitPromiseText() {
    const artifact = $("#promiseScreen .promise-artifact");
    const inner = $("#promiseScreen .artifact-inner");
    const text = $("#promiseText");
    const reference = $("#promiseReference");
    const divider = $("#promiseScreen .artifact-divider");
    const subtitle = $("#promiseSubtitle");
    const label = $("#promiseScreen .artifact-label");
    const quote = $("#promiseScreen .artifact-quote");
    const footer = $("#promiseScreen .artifact-footer");
    if (!artifact || !inner || !text || !reference || !divider || !subtitle || !label || !quote || !footer) return;

    /* Only the Scripture changes size. Everything else keeps its design. */
    text.style.flex = "0 0 auto";
    text.style.margin = "0";
    text.style.overflow = "hidden";
    text.style.maxHeight = "none";
    text.style.height = "auto";

    const original = parseFloat(getComputedStyle(text).fontSize);
    if (!Number.isFinite(original) || original <= 0) return;

    const cs = getComputedStyle(inner);
    const padTop = parseFloat(cs.paddingTop) || 0;
    const padBottom = parseFloat(cs.paddingBottom) || 0;
    const innerHeight = inner.clientHeight;

    /* Fixed content: label, quote, reference, divider, subtitle. */
    const fixed = [label, quote, reference, divider, subtitle];
    let fixedHeight = 0;
    for (const el of fixed) {
        const r = el.getBoundingClientRect();
        const c = getComputedStyle(el);
        fixedHeight += r.height + (parseFloat(c.marginTop) || 0) + (parseFloat(c.marginBottom) || 0);
    }

    /* Reserve the footer and a small visual breathing room. */
    const footerHeight = footer.getBoundingClientRect().height;
    const available = Math.max(90, innerHeight - padTop - padBottom - fixedHeight - footerHeight - 22);

    text.style.height = available + "px";
    text.style.maxHeight = available + "px";

    const fits = () => text.scrollHeight <= available + 1;
    let low = Math.max(14, original * 0.42);
    let high = original;
    let best = low;

    for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        text.style.fontSize = mid + "px";
        if (fits()) { best = mid; low = mid; }
        else { high = mid; }
    }
    text.style.fontSize = best + "px";
}

function showPromise(category) {

    const data =
        CATEGORIES[category];

    if (!data) {
        return;
    }

    currentCategory =
        category;

    /* -------------------------------------------------------
       VERSE SELECTION
       IMPORTANT: The old version displayed data.promise/data.reference
       here, which are only the category's default verse. That meant
       the same verse appeared every time even though 10 verses existed.

       We now cycle through a shuffled order so ALL 10 verses are used
       before any verse can repeat. The state is also saved in localStorage
       so refreshing the page does not reset the cycle.
       ------------------------------------------------------- */
    const verses = Array.isArray(data.verses) ? data.verses : [];
    let selectedVerse = null;

    if (verses.length > 0) {
        const storageKey = `yfjesus_verse_state_v2_${category}`;
        let state = null;

        try {
            state = JSON.parse(localStorage.getItem(storageKey) || "null");
        } catch (error) {
            state = null;
        }

        const validState =
            state &&
            Array.isArray(state.order) &&
            state.order.length === verses.length &&
            state.order.every(index => Number.isInteger(index) && index >= 0 && index < verses.length) &&
            new Set(state.order).size === verses.length &&
            Number.isInteger(state.cursor) &&
            state.cursor >= 0 &&
            state.cursor <= verses.length &&
            typeof state.lastReference === "string";

        if (!validState || state.cursor >= verses.length) {
            /* New shuffled cycle. Avoid starting with the verse shown last. */
            const order = verses.map((_, index) => index);

            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }

            if (state && state.lastReference && order.length > 1 &&
                verses[order[0]].reference === state.lastReference) {
                [order[0], order[1]] = [order[1], order[0]];
            }

            state = {
                order,
                cursor: 0,
                lastReference: state?.lastReference || ""
            };
        }

        const selectedIndex = state.order[state.cursor];
        selectedVerse = verses[selectedIndex];
        currentSelectedVerse = selectedVerse;
        state.cursor += 1;
        state.lastReference = selectedVerse.reference;

        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
            /* localStorage may be unavailable; selection still works. */
        }
    } else {
        /* Safe fallback for any category that has no verse array. */
        selectedVerse = {
            reference: data.reference,
            text: data.promise
        };
        currentSelectedVerse = selectedVerse;
    }

    $("#promiseIcon").textContent =
        data.icon;

    $("#promiseCategory").textContent =
        data.label;

    $("#promiseText").textContent =
        `“${selectedVerse.text}”`;

    $("#promiseReference").textContent =
        selectedVerse.reference;

    $("#promiseSubtitle").textContent =
        data.message;


    showScreen("promise");

    /*
     * Wait for the Promise screen to enter the layout so all dimensions
     * reflect the actual viewport and active-screen CSS.
     */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fitPromiseText();
        });
    });


    setTimeout(
        () => {
            heavenlyChime();
        },
        250
    );

}


/* =========================================================
   PROMISE IMAGE DOWNLOAD
   ========================================================= */

function initializePromiseDownload() {

    const button =
        $("#downloadPromise");

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            clickSound();

            createPromiseImage();

        }
    );

}


/*
 * Initialize separately because the rest of the DOM
 * initialization is kept modular.
 */

document.addEventListener(
    "DOMContentLoaded",
    initializePromiseDownload
);


function createPromiseImage() {

    if (!currentCategory) {
        return;
    }

    const data =
        CATEGORIES[currentCategory];

    const promiseForImage = currentSelectedVerse || {
        reference: promiseForImage.reference,
        text: promiseForImage.text
    };

    if (!data) {
        return;
    }


    /*
     * Square 1:1 output.
     * 1800 × 1800 is suitable for mobile sharing
     * and high-resolution social media use.
     */

    const width = 1800;
    const height = 1800;

    const canvas =
        document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx =
        canvas.getContext("2d");


    /* -------------------------------------------------------
       BACKGROUND
       ------------------------------------------------------- */

    const background =
        ctx.createRadialGradient(
            width * .5,
            height * .38,
            40,
            width * .5,
            height * .5,
            width * .78
        );

    background.addColorStop(
        0,
        "#172f52"
    );

    background.addColorStop(
        .32,
        "#101d38"
    );

    background.addColorStop(
        .62,
        "#160f32"
    );

    background.addColorStop(
        1,
        "#030713"
    );

    ctx.fillStyle =
        background;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* -------------------------------------------------------
       PREMIUM COLOR ACCENTS
       ------------------------------------------------------- */

    const sideGlow = ctx.createRadialGradient(
        width * .12, height * .52, 0,
        width * .12, height * .52, 620
    );
    sideGlow.addColorStop(0, "rgba(52,132,212,.13)");
    sideGlow.addColorStop(1, "rgba(52,132,212,0)");
    ctx.fillStyle = sideGlow;
    ctx.fillRect(0, 0, width, height);

    const lowerGlow = ctx.createRadialGradient(
        width * .5, height * .72, 0,
        width * .5, height * .72, 560
    );
    lowerGlow.addColorStop(0, "rgba(126,62,172,.10)");
    lowerGlow.addColorStop(.5, "rgba(245,201,91,.045)");
    lowerGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = lowerGlow;
    ctx.fillRect(0, 0, width, height);


    /* -------------------------------------------------------
       ATMOSPHERIC GLOW
       -------------------------------------------------------

    const glow =
        ctx.createRadialGradient(
            width * .5,
            height * .4,
            0,
            width * .5,
            height * .4,
            750
        );

    glow.addColorStop(
        0,
        "rgba(255,218,112,.15)"
    );

    glow.addColorStop(
        .3,
        "rgba(71,137,211,.08)"
    );

    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
        glow;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* -------------------------------------------------------
       STARS
       ------------------------------------------------------- */

    for (let i = 0; i < 210; i++) {

        const x =
            Math.random() *
            width;

        const y =
            Math.random() *
            height;

        const radius =
            Math.random() *
            2.3 +
            .4;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            Math.random() > .72
                ? "rgba(255,221,135,.72)"
                : "rgba(255,255,255,.52)";

        ctx.fill();

    }


    /* -------------------------------------------------------
       OUTER FRAME
       ------------------------------------------------------- */

    ctx.strokeStyle =
        "rgba(245,201,91,.8)";

    ctx.lineWidth = 7;

    ctx.strokeRect(
        58,
        58,
        width - 116,
        height - 116
    );


    ctx.strokeStyle =
        "rgba(255,232,160,.28)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        78,
        78,
        width - 156,
        height - 156
    );


    ctx.strokeStyle =
        "rgba(93,165,226,.18)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        105,
        105,
        width - 210,
        height - 210
    );


    /* -------------------------------------------------------
       FINE INNER FRAME
       ------------------------------------------------------- */

    ctx.strokeStyle =
        "rgba(245,201,91,.10)";

    ctx.lineWidth = 1;

    ctx.strokeRect(
        132,
        132,
        width - 264,
        height - 264
    );


    /* -------------------------------------------------------
       CORNER DETAILS
       ------------------------------------------------------- */

    drawCanvasCorner(
        ctx,
        110,
        110,
        1,
        1
    );

    drawCanvasCorner(
        ctx,
        width - 110,
        110,
        -1,
        1
    );

    drawCanvasCorner(
        ctx,
        110,
        height - 110,
        1,
        -1
    );

    drawCanvasCorner(
        ctx,
        width - 110,
        height - 110,
        -1,
        -1
    );


    /* -------------------------------------------------------
       ICON / RADIANT SEAL
       ------------------------------------------------------- */

    ctx.save();
    ctx.translate(width / 2, 310);
    ctx.strokeStyle = "rgba(245,201,91,.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 116, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(245,201,91,.08)";
    ctx.beginPath();
    ctx.arc(0, 0, 145, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(245,201,91,.7)";
    [[0,-135],[0,135],[-135,0],[135,0]].forEach(([x,y]) => {
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-3,-3,6,6);
        ctx.restore();
    });
    ctx.restore();

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.font =
        "112px serif";

    ctx.shadowColor =
        "rgba(255,67,96,.65)";

    ctx.shadowBlur =
        30;

    ctx.fillText(
        data.icon,
        width / 2,
        310
    );

    ctx.shadowBlur = 0;


    /* -------------------------------------------------------
       LABEL
       ------------------------------------------------------- */

    ctx.font =
        "600 28px Arial";

    ctx.letterSpacing =
        "8px";

    ctx.fillStyle =
        "#f5d982";

    drawCenteredSpacedText(
        ctx,
        "YOUR PROMISE",
        width / 2,
        465,
        8
    );


    /* -------------------------------------------------------
       PROMISE
       ------------------------------------------------------- */

    ctx.fillStyle =
        "#fffdf5";

    ctx.font =
        "500 54px Georgia";

    const maxWidth =
        1420;

    const lines =
        wrapCanvasText(
            ctx,
            promiseForImage.text,
            maxWidth
        );

    let y =
        585;

    const lineHeight =
        82;

    lines.forEach(line => {

        ctx.fillText(
            line,
            width / 2,
            y
        );

        y += lineHeight;

    });


    /* -------------------------------------------------------
       REFERENCE
       ------------------------------------------------------- */

    ctx.font =
        "600 28px Arial";

    ctx.fillStyle =
        "#f5c95b";

    drawCenteredSpacedText(
        ctx,
        promiseForImage.reference,
        width / 2,
        y + 48,
        5
    );


    /* -------------------------------------------------------
       DIVIDER
       ------------------------------------------------------- */

    const dividerY =
        Math.max(y + 105, 940);

    ctx.strokeStyle =
        "rgba(245,201,91,.48)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        430,
        dividerY
    );

    ctx.lineTo(
        800,
        dividerY
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        1000,
        dividerY
    );

    ctx.lineTo(
        1370,
        dividerY
    );

    ctx.stroke();

    ctx.font =
        "28px serif";

    ctx.fillStyle =
        "#f5c95b";

    ctx.fillText(
        "✦",
        width / 2,
        dividerY
    );


    /* -------------------------------------------------------
       MESSAGE
       ------------------------------------------------------- */

    ctx.fillStyle =
        "#aeb9cc";

    ctx.font =
        "400 38px Arial";

    const subtitleLines =
        wrapCanvasText(
            ctx,
            data.message,
            1150
        );

    let subtitleY =
        Math.max(dividerY + 72, 1060);

    subtitleLines.forEach(line => {

        ctx.fillText(
            line,
            width / 2,
            subtitleY
        );

        subtitleY += 54;

    });


    /* -------------------------------------------------------
       LOWER ORNAMENT — FILLS THE COMPOSITION WITHOUT ADDING COPY
       ------------------------------------------------------- */

    const ornamentY = 1450;
    ctx.strokeStyle = "rgba(245,201,91,.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(480, ornamentY);
    ctx.lineTo(720, ornamentY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1080, ornamentY);
    ctx.lineTo(1320, ornamentY);
    ctx.stroke();

    ctx.fillStyle = "rgba(245,201,91,.7)";
    ctx.font = "34px serif";
    ctx.fillText("✦", width / 2, ornamentY);

    ctx.strokeStyle = "rgba(245,201,91,.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(width / 2, ornamentY, 70, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();


    /* -------------------------------------------------------
       FOOTER
       ------------------------------------------------------- */

    ctx.font =
        "600 20px Arial";

    ctx.fillStyle =
        "rgba(255,255,255,.36)";

    drawCenteredSpacedText(
        ctx,
        "YOU FOUND JESUS",
        width / 2,
        height - 118,
        6
    );


    /* -------------------------------------------------------
       DOWNLOAD
       ------------------------------------------------------- */

    const link =
        document.createElement("a");

    link.download =
        `you-found-jesus-${currentCategory}.png`;

    link.href =
        canvas.toDataURL(
            "image/png"
        );

    link.click();

}


function drawCanvasCorner(
    ctx,
    x,
    y,
    sx,
    sy
) {

    ctx.strokeStyle =
        "rgba(255,225,145,.85)";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(
        x,
        y + 80 * sy
    );

    ctx.lineTo(
        x,
        y
    );

    ctx.lineTo(
        x + 80 * sx,
        y
    );

    ctx.stroke();

}


function drawCenteredSpacedText(
    ctx,
    text,
    centerX,
    y,
    spacing
) {

    /*
     * Canvas does not consistently support
     * letterSpacing, so calculate it manually.
     */

    const characters =
        [...text];

    const widths =
        characters.map(
            char =>
                ctx.measureText(char).width
        );

    const total =
        widths.reduce(
            (sum, value) =>
                sum + value,
            0
        ) +
        spacing *
        Math.max(
            0,
            characters.length - 1
        );

    let x =
        centerX -
        total / 2;

    characters.forEach(
        (char, index) => {

            ctx.fillText(
                char,
                x +
                widths[index] / 2,
                y
            );

            x +=
                widths[index] +
                spacing;

        }
    );

}


function wrapCanvasText(
    ctx,
    text,
    maxWidth
) {

    const words =
        text.split(" ");

    const lines = [];

    let line = "";

    words.forEach(word => {

        const test =
            line
                ? `${line} ${word}`
                : word;

        const width =
            ctx.measureText(test).width;

        if (
            width >
            maxWidth &&
            line
        ) {

            lines.push(line);

            line = word;

        } else {

            line = test;

        }

    });

    if (line) {
        lines.push(line);
    }

    return lines;

}


/* =========================================================
   DISCOVER BACK
   ========================================================= */

function initializeBackButtons() {

    /*
     * One capture-phase navigation handler for BOTH static and dynamically
     * created controls.  The journey completion buttons are rebuilt with
     * innerHTML, so binding only once to the original DOM nodes is fragile.
     */
    document.addEventListener("click", event => {

        const target = event.target instanceof Element
            ? event.target
            : null;

        if (!target) return;

        const back = target.closest("[data-back]");

        if (back) {
            event.preventDefault();
            event.stopPropagation();
            clickSound();

            const destination = back.dataset.back;
            if (destination) showScreen(destination);
            return;
        }

        const actionCard = target.closest("[data-action]");

        if (actionCard) {
            event.preventDefault();
            event.stopPropagation();
            const action = actionCard.dataset.action;
            clickSound();

            if (action === "movie") openMovie();
            else if (action === "pray") openPrayer();
            else if (action === "gospel") openGospel();
            else if (action === "discover") showScreen("discover");
            return;
        }

        /* Explicit fallbacks for dynamically-created journey completion buttons. */
        const journeyPrayer = target.closest("#journeyPrayerButton");
        if (journeyPrayer) {
            event.preventDefault();
            event.stopPropagation();
            clickSound();
            openPrayer();
            return;
        }

        const journeyDiscover = target.closest("#journeyDiscoverButton");
        if (journeyDiscover) {
            event.preventDefault();
            event.stopPropagation();
            clickSound();
            showScreen("discover");
            return;
        }

    }, true);

}



/* =========================================================
   MOVIE
   ========================================================= */

function initializeMovie() {

    /*
     * Movie controls are primarily initialized
     * through openMovie().
     */

}


function openMovie() {

    movieWasOpened = true;

    clickSound();

    stopBackgroundMusic();


    const frame =
        $("#movieFrame");

    const placeholder =
        $("#moviePlaceholder");


    if (!frame) {
        return;
    }


    const videoId =
        String(
            CONFIG.youtubeVideoId || ""
        ).trim();


    /*
     * If the project is being opened directly from
     * file://, YouTube may return Error 153 because
     * there is no HTTP Referer.
     *
     * We still load the embed, but local testing should
     * be done through localhost.
     */

    if (
        !videoId ||
        videoId === "YOUR_VIDEO_ID"
    ) {

        if (placeholder) {
            placeholder.style.display =
                "flex";
        }

        frame.src = "";

    } else {

        if (placeholder) {
            placeholder.style.display =
                "none";
        }

        /*
         * Use the standard YouTube embed endpoint.
         * When the experience is hosted over HTTP/HTTPS,
         * pass the current origin to YouTube.
         * This does not alter the visual design.
         */
        const embedOrigin =
            (
                window.location.protocol === "http:" ||
                window.location.protocol === "https:"
            )
                ? "&origin=" +
                  encodeURIComponent(
                      window.location.origin
                  )
                : "";

        frame.src =
            "https://www.youtube.com/embed/" +
            encodeURIComponent(
                videoId
            ) +
            "?rel=0&modestbranding=1&playsinline=1" +
            embedOrigin;

    }


    showScreen("movie");

}


/* =========================================================
   PRAYER
   ========================================================= */

function initializePrayer() {

    const form =
        $("#prayerForm");

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            clickSound();

            const name =
                $("#prayerName")?.value.trim() ||
                "";

            const phone =
                $("#prayerPhone")?.value.trim() ||
                "";

            const email =
                $("#prayerEmail")?.value.trim() ||
                "";

            const request =
                $("#prayerRequest")?.value.trim() ||
                "";


            const button =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (button) {

                button.disabled =
                    true;

                button.dataset.originalText =
                    button.textContent;

                button.textContent =
                    "SENDING...";

            }


            const payload = {
    name,
    phone,
    email,
    prayerRequest: request,
    source: "You Found Jesus",
    createdAt: new Date().toISOString()
};


            try {

                if (
                    CONFIG.prayerEndpoint
                ) {

                    await fetch(
    CONFIG.prayerEndpoint,
    {
        method: "POST",
        body: new URLSearchParams(payload)
    }
);

                }


                showPrayerSuccess();

                heavenlyChime();

            } catch (error) {

                console.error(
                    "Prayer submission failed:",
                    error
                );

                /*
                 * Still show confirmation in the
                 * current front-end experience.
                 */

                showPrayerSuccess();

            } finally {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        button.dataset.originalText ||
                        "🙏 SEND MY PRAYER";

                }

            }

        }
    );

}


function showPrayerSuccess() {

    const page =
        document.querySelector(".prayer-page");

    const form =
        $("#prayerForm");

    const success =
        $("#prayerSuccess");

    const back =
        document.querySelector("#prayerScreen [data-back]");

    if (form) {
        form.style.display = "none";
    }

    if (page) {
        page.classList.add("success-mode");
    }

    if (success) {
        success.style.display = "flex";
    }

    if (back) {
        back.textContent = "← BACK TO DISCOVER";
        back.dataset.back = "discover";
    }

}


function openPrayer() {

    clickSound();

    const page =
        document.querySelector(".prayer-page");

    const form =
        $("#prayerForm");

    const success =
        $("#prayerSuccess");

    const back =
        document.querySelector("#prayerScreen [data-back]");

    if (page) {
        page.classList.remove("success-mode");
    }

    if (form) {
        form.style.display = "flex";
    }

    if (success) {
        success.style.display = "none";
    }

    if (back) {
        back.textContent = "← BACK";
        back.dataset.back = "discover";
    }

    showScreen("prayer");

}


/* =========================================================
   GOSPEL
   ========================================================= */

function initializeGospel() {

    const next =
        $("#gospelNext");

    const prev =
        $("#gospelPrev");


    if (next) {

        next.addEventListener(
            "click",
            () => {

                clickSound();

                if (
                    currentGospel <
                    GOSPEL.length - 1
                ) {

                    currentGospel++;

                    updateGospel();

                } else {

                    finishGospel();

                }

            }
        );

    }


    if (prev) {

        prev.addEventListener(
            "click",
            () => {

                clickSound();

                if (
                    currentGospel > 0
                ) {

                    currentGospel--;

                    updateGospel();

                }

            }
        );

    }

}


function openGospel() {

    clickSound();

    currentGospel = 0;

    const page =
        document.querySelector(
            ".gospel-page"
        );

    if (page) {

        page.classList.remove(
            "response-mode"
        );

    }


    const journey =
        $("#responseJourney");

    if (journey) {

        journey.classList.remove(
            "active"
        );

        journey.classList.remove("journey-complete");

        journey.style.display =
            "none";

    }

    const journeyHead =
        document.querySelector("#responseJourney .journey-head");

    if (journeyHead) {
        journeyHead.classList.remove("journey-complete-head");
    }

    const journeyNavigation =
        document.querySelector("#gospelScreen .journey-navigation");

    if (journeyNavigation) {
        journeyNavigation.style.display = "grid";
    }


    const stage =
        $("#gospelStage");

    const controls =
        document.querySelector(
            ".gospel-controls"
        );

    const title =
        document.querySelector(
            ".gospel-title"
        );

    const eyebrow =
        document.querySelector(
            "#gospelScreen .section-eyebrow"
        );

    const progress =
        document.querySelector(
            ".gospel-progress"
        );

    if (stage) {
        stage.style.display = "";
    }

    if (controls) {
        controls.style.display = "";
    }

    if (title) {
        title.style.display = "";
    }

    if (eyebrow) {
        eyebrow.style.display = "";
    }

    if (progress) {
        progress.style.display = "";
    }


    updateGospel(false);

    showScreen("gospel");

}


function updateGospel(animate = true) {

    const data = GOSPEL[currentGospel];
    const stage = $("#gospelStage");

    if (!data || !stage) return;

    clearTimeout(gospelTransitionTimer);

    if (!animate) {
        stage.classList.remove("gospel-transition-out", "gospel-transition-in");
        renderGospelContent(data);
        return;
    }

    stage.classList.remove("gospel-transition-in");
    stage.classList.add("gospel-transition-out");

    gospelTransitionTimer = setTimeout(() => {
        renderGospelContent(data);
        stage.classList.remove("gospel-transition-out");
        void stage.offsetWidth;
        stage.classList.add("gospel-transition-in");

        gospelTransitionTimer = setTimeout(() => {
            stage.classList.remove("gospel-transition-in");
        }, 1320);
    }, 680);
}


function renderGospelContent(data) {

    const number =
        $(".gospel-number");

    const icon =
        $("#gospelIcon");

    const heading =
        $("#gospelHeading");

    const text =
        $("#gospelText");

    const count =
        $("#gospelCount");

    const progress =
        $("#gospelProgress");

    if (number) {
        number.textContent =
            data.number;
    }

    if (icon) {
        icon.textContent =
            data.icon;
    }

    if (heading) {
        heading.textContent =
            data.heading;
    }

    if (text) {
        text.textContent =
            data.text;
    }

    if (count) {
        count.textContent =
            `${currentGospel + 1} / ${GOSPEL.length}`;
    }

    if (progress) {
        progress.style.width =
            `${((currentGospel + 1) / GOSPEL.length) * 100}%`;
    }

}



/* =========================================================
   FINISH GOSPEL
   ========================================================= */

function finishGospel() {

    swoosh();

    cinematicImpact();


    const journey =
        $("#responseJourney");

    const page =
        document.querySelector(
            ".gospel-page"
        );

    const stage =
        $("#gospelStage");

    const controls =
        document.querySelector(
            ".gospel-controls"
        );

    const title =
        document.querySelector(
            ".gospel-title"
        );

    const eyebrow =
        document.querySelector(
            "#gospelScreen .section-eyebrow"
        );

    const progress =
        document.querySelector(
            ".gospel-progress"
        );


    if (!journey || !page) {
        return;
    }


    journey.classList.remove(
        "active"
    );


    if (stage) {
        stage.style.display =
            "none";
    }

    if (controls) {
        controls.style.display =
            "none";
    }

    if (title) {
        title.style.display =
            "none";
    }

    if (eyebrow) {
        eyebrow.style.display =
            "none";
    }

    if (progress) {
        progress.style.display =
            "none";
    }


    page.classList.add(
        "response-mode"
    );


    /*
     * Explicitly force the journey visible.
     * This prevents stale inline display:none
     * from older versions of the experience.
     */

    journey.style.display =
        "flex";


    openResponseJourney();

}


/* =========================================================
   RESPONSE JOURNEY
   ========================================================= */

function initializeJourney() {

    const next =
        $("#journeyNext");

    const prev =
        $("#journeyPrev");


    if (next) {

        next.addEventListener(
            "click",
            () => {

                clickSound();

                nextResponseStep();

            }
        );

    }


    if (prev) {

        prev.addEventListener(
            "click",
            () => {

                clickSound();

                previousResponseStep();

            }
        );

    }

}


function resetJourneyNavigation() {

    currentResponseStep =
        0;

}


function openResponseJourney() {

    const journey =
        $("#responseJourney");

    if (!journey) {
        return;
    }


    journey.classList.add(
        "active"
    );

    journey.classList.remove("journey-complete");

    const journeyHead =
        document.querySelector("#responseJourney .journey-head");

    if (journeyHead) {
        journeyHead.classList.remove("journey-complete-head");
    }

    journey.style.display =
        "flex";

    const navigation =
        document.querySelector("#gospelScreen .journey-navigation");

    if (navigation) {
        navigation.style.display = "grid";
    }


    resetJourneyNavigation();

    renderResponseJourney();


    setTimeout(
        () => {
            heavenlyChime();
        },
        450
    );

}


function renderResponseJourney(animate = true) {

    const data = RESPONSE_JOURNEY[currentResponseStep];
    const stage = $("#journeyStage");
    const progress = $("#journeyProgress");
    const count = $("#journeyCount");
    const next = $("#journeyNext");
    const prev = $("#journeyPrev");
    const stepDots = $$(".journey-steps span");

    if (!data || !stage) return;

    clearTimeout(journeyTransitionTimer);

    const apply = () => {
        let html = `<div class="journey-card">
            <div class="journey-icon">${data.icon}</div>
            <h3>${escapeHtml(data.heading)}<br><span>${escapeHtml(data.subtitle)}</span></h3>
            <p>${escapeHtml(data.text)}</p>`;

        if (data.quote) html += `<div class="journey-quote">${escapeHtml(data.quote)}</div>`;

        if (data.bullets) {
            html += `<div class="journey-bullets">`;
            data.bullets.forEach(bullet => {
                html += `<div>✦ ${escapeHtml(bullet)}</div>`;
            });
            html += `</div>`;
        }

        if (data.prayer) html += `<div class="journey-prayer">${escapeHtml(data.prayer)}</div>`;
        html += `</div>`;

        stage.innerHTML = html;
        stage.dataset.step = String(currentResponseStep);

        if (progress) progress.style.width = `${((currentResponseStep + 1) / RESPONSE_JOURNEY.length) * 100}%`;
        if (count) count.textContent = `${String(currentResponseStep + 1).padStart(2,"0")} / ${String(RESPONSE_JOURNEY.length).padStart(2,"0")}`;
        if (prev) prev.style.visibility = currentResponseStep === 0 ? "hidden" : "visible";
        if (next) next.textContent = currentResponseStep === RESPONSE_JOURNEY.length - 1 ? "FINISH MY JOURNEY →" : "CONTINUE →";
        stepDots.forEach((dot, index) => dot.classList.toggle("active", index === currentResponseStep));
    };

    if (!animate || !stage.querySelector(".journey-card")) {
        apply();
        return;
    }

    journeyAnimating = true;
    stage.animate(
        [
            { opacity: 1, transform: "translateY(0) scale(1)" },
            { opacity: 0, transform: "translateY(-10px) scale(.992)" }
        ],
        { duration: 720, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" }
    );

    journeyTransitionTimer = setTimeout(() => {
        stage.getAnimations().forEach(a => a.cancel());
        apply();
        stage.animate(
            [
                { opacity: 0, transform: "translateY(12px) scale(.992)" },
                { opacity: 1, transform: "translateY(0) scale(1)" }
            ],
            { duration: 1450, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }
        );
        journeyTransitionTimer = setTimeout(() => { journeyAnimating = false; }, 1470);
    }, 740);
}


function nextResponseStep() {

    if (journeyAnimating) return;

    if (
        currentResponseStep <
        RESPONSE_JOURNEY.length - 1
    ) {

        currentResponseStep++;

        renderResponseJourney();

        setTimeout(() => heavenlyChime(), 720);

    } else {

        showResponseCompletion();

    }

}


function previousResponseStep() {

    if (journeyAnimating) return;

    if (
        currentResponseStep > 0
    ) {

        currentResponseStep--;

        renderResponseJourney();

        setTimeout(() => heavenlyChime(), 720);

    }

}


/* =========================================================
   RESPONSE COMPLETION
   ========================================================= */

function showResponseCompletion() {

    if (journeyAnimating) return;
    journeyAnimating = true;
    swoosh();
    setTimeout(() => heavenlyChime(), 700);


    const stage =
        $("#journeyStage");

    if (stage) {
        stage.style.display = "flex";
        stage.style.opacity = "1";
        stage.style.transform = "none";
    }

    const progress =
        $("#journeyProgress");

    const count =
        $("#journeyCount");

    const next =
        $("#journeyNext");

    const prev =
        $("#journeyPrev");

    const stepDots =
        $$(".journey-steps span");

    const journeyContainer =
        $("#responseJourney");


    if (!stage) {
        journeyAnimating = false;
        return;
    }

    stage.animate(
        [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-10px)" }
        ],
        { duration: 620, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" }
    );

    journeyTransitionTimer = setTimeout(() => {

    if (journeyContainer) {
        journeyContainer.classList.add("journey-complete");
    }

    const journeyHead =
        document.querySelector("#responseJourney .journey-head");

    if (journeyHead) {
        journeyHead.classList.add("journey-complete-head");
    }


    stage.innerHTML = `

        <div class="journey-completion end-page">

            <div class="completion-icon">
                ✨
            </div>

            <div class="completion-title">
                THANK
                <span>YOU.</span>
            </div>

            <p class="completion-text">
                Thank you for taking this journey with Jesus.
                May His love, grace, and peace remain with you
                as you take your next steps with Him.
            </p>

            <div class="completion-blessing">
                <span>✦</span>
                May the Lord bless you and keep you.
                <span>✦</span>
            </div>

               </div>

    `;


    if (progress) {

        progress.style.width =
            "100%";

    }


    if (count) {

        count.textContent =
            "✦";

    }


    if (next) {

        next.style.display =
            "none";

    }


    if (prev) {

        prev.style.visibility =
            "hidden";

    }

    const navigation =
        document.querySelector("#gospelScreen .journey-navigation");

    if (navigation) {
        navigation.style.display = "none";
    }

    const journey =
        $("#responseJourney");

    if (journey) {
        journey.classList.add("journey-complete");
    }


    stepDots.forEach(
        dot => {

            dot.classList.add(
                "active"
            );

        }
    );


    /* Completion buttons are handled by the global capture-phase navigator. */
    const endPage = stage.querySelector(".end-page");
    if (endPage) {
        endPage.animate(
            [
                { opacity: 0, transform: "translateY(18px) scale(.992)" },
                { opacity: 1, transform: "translateY(0) scale(1)" }
            ],
            { duration: 1550, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }
        );
    }
    journeyAnimating = false;

    }, 680);

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   WINDOW RESIZE
   ========================================================= */

let resizeTimer = null;

window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );

        resizeTimer =
            setTimeout(
                () => {

                    /*
                     * Rebuild only the ambient particles.
                     * No screen/state is changed.
                     */

                    createStars();

                    createDust();

                    createHearts();

                },
                250
            );

    }
);


/* =========================================================
   TOUCH / POINTER ATMOSPHERE
   ========================================================= */

document.addEventListener(
    "pointermove",
    event => {

        /*
         * Very subtle global parallax.
         * Disabled on coarse touch devices.
         */

        if (
            window.matchMedia(
                "(pointer: coarse)"
            ).matches
        ) {
            return;
        }

        const x =
            event.clientX /
            window.innerWidth;

        const y =
            event.clientY /
            window.innerHeight;

        const root =
            document.documentElement;

        root.style.setProperty(
            "--pointer-x",
            `${(x - .5) * 2}`
        );

        root.style.setProperty(
            "--pointer-y",
            `${(y - .5) * 2}`
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   VISIBILITY HANDLING
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            stopBackgroundMusic();

        } else if (
            soundEnabled
        ) {

            startBackgroundMusic();

        }

    }
);


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const activeScreen =
            document.querySelector(
                ".screen.active"
            );


        if (!activeScreen) {
            return;
        }


        /*
         * Gospel keyboard navigation.
         */

        if (
            activeScreen.id ===
            "gospelScreen"
        ) {

            if (
                event.key ===
                "ArrowRight"
            ) {

                $("#gospelNext")?.click();

            }

            if (
                event.key ===
                "ArrowLeft"
            ) {

                $("#gospelPrev")?.click();

            }

        }

    }
);


/* =========================================================
   FINAL INITIAL STATE
   ========================================================= */

(function setInitialState() {

    const sound =
        $("#soundToggle");

    if (sound) {

        sound.textContent =
            "🔊";

    }

})();
