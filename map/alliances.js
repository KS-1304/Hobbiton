// Alliance colours for the world map.
//
// Tags are CASE-SENSITIVE: "LGN" and "LgN" are different alliances.
// Each entry: bg = marker/legend background, text = icon colour, border = CSS border.
// Any tag not listed here gets an automatic colour derived from its name,
// so new alliances always show up without editing this file.
var ALLIANCES = {
    "LGN":    { bg: "red",            text: "black", border: "2px dashed white" },
    "LgN":    { bg: "pink",           text: "black", border: "2px dashed white" },
    "HOB":    { bg: "white",          text: "black", border: "2px dashed black" },
    "hob":    { bg: "lightgray",      text: "black", border: "2px dashed black" },
    "FRA":    { bg: "lightblue",      text: "black", border: "2px dashed white" },
    "MCC":    { bg: "green",          text: "white", border: "2px dashed white" },
    "mcc":    { bg: "blue",           text: "white", border: "2px dashed white" },
    "RHb":    { bg: "orange",         text: "black", border: "2px dashed white" },
    "PTG":    { bg: "mediumpurple",   text: "white", border: "2px dashed white" },
    "RiP":    { bg: "steelblue",      text: "white", border: "2px dashed white" },
    "RSE":    { bg: "hotpink",        text: "white", border: "2px dashed white" },
    "KLK":    { bg: "sienna",         text: "white", border: "2px dashed white" },
    "FKN":    { bg: "orange",         text: "black", border: "2px dashed white" },
    "KVK":    { bg: "gold",           text: "black", border: "2px dashed white" },
    "CcC":    { bg: "green",          text: "white", border: "2px dashed white" },
    "CCC":    { bg: "lightseagreen",  text: "black", border: "2px dashed white" },
    "TMA":    { bg: "blue",           text: "white", border: "2px dashed white" },
    "SAX":    { bg: "purple",         text: "white", border: "2px dashed white" },
    "AGw":    { bg: "yellow",         text: "black", border: "2px dashed white" },

    // Not alliances: neutral holders of Sanctuaries/Fortresses and the King's Castle.
    "Rebels": { bg: "dimgray",        text: "white", border: "2px dashed white" },
    "KING":   { bg: "transparent",    text: "black", border: "none" }
};

// Owners that are not alliances (left out of the legend and the "View as" list).
var NON_ALLIANCE_OWNERS = ["Rebels", "KING"];

function isAllianceTag(tag) {
    return typeof tag === 'string' && tag !== '' && NON_ALLIANCE_OWNERS.indexOf(tag) === -1;
}

// Deterministic colour for tags that are not in ALLIANCES.
function autoAllianceStyle(tag) {
    // FNV-1a hash over the tag's characters (case-sensitive).
    var h = 2166136261;
    for (var i = 0; i < tag.length; i++) {
        h ^= tag.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    var hue = h % 360;
    var sat = 55 + ((h >>> 9) % 30);   // 55-84%
    var light = 38 + ((h >>> 17) % 30); // 38-67%

    // Pick black or white text by the background's luminance.
    var s = sat / 100, l = light / 100;
    var a = s * Math.min(l, 1 - l);
    function channel(n) {
        var k = (n + hue / 30) % 12;
        var c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    var lum = 0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4);

    return {
        bg: 'hsl(' + hue + ', ' + sat + '%, ' + light + '%)',
        text: lum > 0.179 ? 'black' : 'white',
        border: '2px dashed white'
    };
}

var _autoStyleCache = {};

function allianceStyle(tag) {
    tag = (tag === undefined || tag === null) ? '' : String(tag);
    if (Object.prototype.hasOwnProperty.call(ALLIANCES, tag)) {
        return ALLIANCES[tag];
    }
    if (!Object.prototype.hasOwnProperty.call(_autoStyleCache, tag)) {
        _autoStyleCache[tag] = autoAllianceStyle(tag);
    }
    return _autoStyleCache[tag];
}

// Inline CSS for a marker or legend box of the given tag.
function allianceCss(tag) {
    var st = allianceStyle(tag);
    return 'background-color: ' + st.bg + '; color: ' + st.text + '; border: ' + st.border + ';';
}
