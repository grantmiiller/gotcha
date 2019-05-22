(function() {
    const searchParams = new URLSearchParams(window.location.search);
    const greetingDOM = document.getElementById('greeting');
    const greetingForm = document.getElementById('greetingForm');
    const greetingInput = document.getElementById('greetingInput');


    function updateGreeting(friend) {
        greetingDOM.innerHTML = `Hi ${friend}!`;
    }

    let name = searchParams.get('friendname');
    if (name) {
        greetingInput.value = name;
        updateGreeting(name);
    }

    greetingForm.addEventListener('submit', function handleFormSubmit(e) {
        e.preventDefault();
        if (greetingInput.value) {
            updateGreeting(greetingInput.value);
        }
    });
})();