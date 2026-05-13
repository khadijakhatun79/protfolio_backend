function weeksPassedFromDate(dateString) {
    const givenDate = new Date(dateString); // Parse the input date
    const currentDate = new Date(); // Get the current date

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - givenDate;

    // Convert milliseconds to weeks (1 week = 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const weeksPassed = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));

    return weeksPassed;
}

function calculatePlayerRating(player, match, ratingFrom = null) {
    let rating = 5.0; // Base rating

    // 1. Goals Scored
    if (player?.goals !== undefined && player?.goals !== null) {
        const goalPoints = Math.min(player.goals, 3) * 0.8; // Scale goals to max +2.4
        rating += goalPoints;
    }

    // 2. Difficulty of the Game
    // const difficultyMultiplier = match.opponentDifficulty;

    // 3. Cards Received
    if (
        (player?.yellowCards !== undefined && player?.yellowCards !== null) ||
        (player?.redCards !== undefined && player?.redCards !== null)
    ) {
        const cardPenalty =
            (player?.yellowCards ? player.yellowCards * 0.2 : 0) +
            (player?.redCards ? player.redCards * 1.0 : 0); // Scale penalties to max -1.0
        rating -= cardPenalty;
    }
    // 4. Minutes Played
    let minutesBonus = 0.0;
    if (player?.minutesPlayed) {
        if (player.minutesPlayed >= 90) minutesBonus = 0.5;
        else if (player.minutesPlayed >= 60) minutesBonus = 0.3;
        else if (player.minutesPlayed >= 30) minutesBonus = 0.1;
        rating += minutesBonus;
    }

    // 5. Votes
    // const votePoints =
    //     player.votes.coachFirst * 0.2 +
    //     player.votes.coachSecond * 0.1 +
    //     player.votes.coachThird * 0.05 +
    //     player.votes.playerFirst * 0.1 +
    //     player.votes.playerSecond * 0.05 +
    //     player.votes.playerThird * 0.02;
    if (
        player?.votes !== undefined &&
        player?.votes !== null &&
        player?.votes !== -1
    ) {
        if (ratingFrom === "coach") {
            let coachRatings = [0.5, 0.3, 0.2];
            let ratingIndex = Math.min(player.votes, 2); // Ensure index is within bounds (0-2)
            rating += coachRatings[ratingIndex]; // Max +0.5 from votes // player.votes is index of player id from the voting array by coach
        } else if (ratingFrom === "player") {
            let playerRatings = [0.3, 0.2, 0.1];
            let ratingIndex = Math.min(player.votes, 2); // Ensure index is within bounds (0-2)
            rating += playerRatings[ratingIndex]; // Max +0.3 from votes // player.votes is index of player id from the voting array by player
        }
    }

    // 6. Assists
    if (player?.assists !== undefined && player?.assists !== null) {
        const assistPoints = Math.min(player.assists, 3) * 0.5; // Max +1.5
        rating += assistPoints;
    }
    // 7. Game Result
    if (player?.matchResult) {
        if (player.matchResult === "win") rating += 0.3;
        else if (player.matchResult === "lose") rating -= 0.5;
    }

    // 8. Clean Sheet
    if (
        player?.yellowCards === undefined &&
        player?.yellowCards === null &&
        player?.redCards === undefined &&
        player?.redCards === null
    ) {
        rating += 0.5;
    }

    // 9. Penalty Save
    // if (player.penaltySave) rating += 0.8;

    // 10. Clips Uploaded
    if (player?.clipsUploaded !== undefined && player?.clipsUploaded !== null) {
        const clipPoints = Math.min(player.clipsUploaded * 0.1, 0.3); // Max +0.3
        rating += clipPoints;
    }
    // Apply Difficulty Multiplier
    // rating *= difficultyMultiplier;

    // Clamp rating between 5.0 and 10.0
    rating = Math.max(1.0, Math.min(rating, 10.0));

    return parseFloat(rating.toFixed(1)); // Optional: Round to 2 decimal places
}

const convertBooleanFields = (obj, fields) => {
    fields.forEach((field) => {
        if (obj[field] !== undefined) obj[field] = obj[field] === "true";
    });
};

const compareInputObjects = (obj1, obj2) => {
    for (const key in obj1) {
        if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key]))
            return false;
    }
    return true;
};

module.exports = {
    weeksPassedFromDate,
    calculatePlayerRating,
    convertBooleanFields,
    compareInputObjects,
};
