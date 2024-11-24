// Update chart visualization
if (poll.totalVotes > 0) {
    chartContainer.innerHTML += `<h3>${poll.question}</h3>`;
    poll.choices.forEach((choice) => {
        const percentage = (choice.votes / poll.totalVotes) * 100;
        chartContainer.innerHTML += `
            <div class="bar">
                <div style="width: ${percentage}%; max-width: 100%;">${choice.option} (${choice.votes} votes)</div>
            </div>
        `;
    });
} else {
    chartContainer.innerHTML += `<h3>${poll.question}</h3><p>No votes yet.</p>`;
}
