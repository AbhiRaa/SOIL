/**
 * A list of additional profanity words, phrases, and patterns that extend beyond the basic set
 * provided by bad-words filtering libraries. This list is used to customize the profanity filtering
 * to be more comprehensive and specific to the cultural and contextual requirements of the platform.
 *
 * Categories Included:
 * - Slurs and Derogatory Language: Contains terms that are racially, ethnically, or otherwise derogatory.
 * - Regional Slang: Includes profanities and slurs specific to particular regions or cultures.
 * - Newly Coined Phrases: Covers phrases that have emerged from internet culture, memes, or recent media.
 * - Double Entendres and Euphemisms: Phrases with double meanings, often used to bypass simple filters.
 * - Common Misspellings of Profanities: Variants of common swear words altered to evade standard filters.
 * - Abbreviations and Acronyms: Commonly used abbreviated swear words and offensive expressions.
 *
 * Usage:
 * This array is imported into modules that handle text input to filter out inappropriate content,
 * ensuring user-generated content (UGC) adheres to community guidelines and maintains a respectful
 * environment.
 *
 * Example Usage:
 * Used in conjunction with libraries `bad-words` to create a more robust filtering system
 * for a review on products.
 */

const additionalProfanities = [
    // Slurs and Derogatory Language
    'slur1', 'slur2', 'ethnicSlur', 'genderSlur', 'sexualOrientationSlur', 'disabilitySlur',
  
    // Regional Slang
    'regionalProfanity1', 'regionalProfanity2', 'regionalSlur',
  
    // Newly Coined Phrases
    'internetSlang1', 'memePhrase1',
  
    // Double Entendres and Euphemisms
    'doubleMeaning1', 'euphemism1',
  
    // Common Misspellings of Profanities
    'fuc*', 'sh*t', 'bi**h', 'a**hole', 'cr*p',
  
    // Abbreviations and Acronyms
    'WTF', 'OMFG', 'STFU'
  ];
  
  export default additionalProfanities;
  