async function sendMessage() {
  const input = document.getElementById("userInput").value;
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${input}</p>`;
  document.getElementById("userInput").value = "";

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",   // or whichever model you pulled
      prompt: input
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let botReply = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Decode chunk and split by newlines
    const chunk = decoder.decode(value, { stream: true }).trim().split("\n");
    for (const line of chunk) {
      if (!line) continue;
      try {
        const json = JSON.parse(line);
        if (json.response) {
          botReply += json.response;
        }
      } catch (e) {
        console.error("Bad chunk:", line);
      }
    }
  }

  document.getElementById("chat").innerHTML += `<p><b>Bot:</b> ${botReply}</p>`;
}
