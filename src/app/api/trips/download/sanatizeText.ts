export default function sanitizeText(text: string): string {
    let sanitized = text
        // Japanese characters
        .replace(/〒/g, "Post: ") // Postal symbol
        .replace(/[ひらがな]/g, "") // Hiragana range would be /[\u3040-\u309F]/g
        .replace(/[カタカナ]/g, "") // Katakana range would be /[\u30A0-\u30FF]/g
        .replace(/[漢字]/g, "") // Kanji range would be /[\u4E00-\u9FAF]/g
        
        // European accented characters
        .replace(/[àáâãäåæ]/g, "a")
        .replace(/[èéêë]/g, "e")
        .replace(/[ìíîï]/g, "i")
        .replace(/[òóôõöø]/g, "o")
        .replace(/[ùúûü]/g, "u")
        .replace(/[ÀÁÂÃÄÅÆ]/g, "A")
        .replace(/[ÈÉÊË]/g, "E")
        .replace(/[ÌÍÎÏ]/g, "I")
        .replace(/[ÒÓÔÕÖØ]/g, "O")
        .replace(/[ÙÚÛÜ]/g, "U")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "C")
        .replace(/ñ/g, "n")
        .replace(/Ñ/g, "N")
        .replace(/ß/g, "ss")
        
        // Quotes and dashes
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/[–—]/g, "-")
        
        // Currency symbols
        .replace(/[€£¥₹₩]/g, "")
        
        // Other common symbols
        .replace(/[©®™]/g, "")
        .replace(/[°]/g, " deg ")
        .replace(/[µ]/g, "u")
        
        // Korean characters
        .replace(/[가-힣]/g, "") // Hangul
        
        // Chinese characters (simplified/traditional)
        .replace(/[一-龯]/g, "") // CJK Unified Ideographs
        
        // Arabic characters  
        .replace(/[ؠ-ي]/g, "")
        
        // Cyrillic characters
        .replace(/[А-я]/g, "")
        
        // Mathematical symbols
        .replace(/[×÷±∞≤≥≠]/g, "")
        
        // Final fallback: replace any remaining non-ASCII with space
        .replace(/[^\x00-\x7F]/g, " ")
        
        // Clean up multiple spaces
        .replace(/\s+/g, " ")
        .trim();

    return sanitized;
}