document.addEventListener('DOMContentLoaded', () => {
    const inputText1 = document.getElementById('inputText1');
    const inputText2 = document.getElementById('inputText2');
    const compareBtn = document.getElementById('compareBtn');
    const formattedText1 = document.getElementById('formattedText1');
    const formattedText2 = document.getElementById('formattedText2');
    const diffText1 = document.getElementById('diffText1');
    const diffText2 = document.getElementById('diffText2');
    const diffCount1 = document.getElementById('diffCount1');
    const diffCount2 = document.getElementById('diffCount2');
    const cleanBtn = document.getElementById('cleanBtn');

    const formatText = (text) => {
        return text.replace(/\s+/g, '');
    };

    compareBtn.addEventListener('click', () => {
        const text1 = inputText1.value;
        const text2 = inputText2.value;

        // Formatear los textos
        const formattedText1Value = formatText(text1);
        const formattedText2Value = formatText(text2);
        
        formattedText1.textContent = formattedText1Value;
        formattedText2.textContent = formattedText2Value;

        // Enviar los textos formateados al servidor
        fetch('http://localhost:4000/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text1: formattedText1Value, text2: formattedText2Value })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                diffText1.textContent = data.error;
                diffText2.textContent = '';
                return;
            }
            renderDiff(data.differences);
        })
        .catch(err => {
            diffText1.textContent = 'Error al comparar textos.';
            diffText2.textContent = '';
            console.error(err);
        });
    });

    const renderDiff = (differences) => {
        diffText1.innerHTML = '';
        diffText2.innerHTML = '';
        let countDifferences1 = 0;
        let countDifferences2 = 0;
    
        differences.forEach(part => {
            if (part.added) {
                const span2 = document.createElement('span');
                span2.classList.add('red'); 
                span2.textContent = part.value;
                diffText2.appendChild(span2);
                countDifferences2++;
            } else if (part.removed) {
                const span1 = document.createElement('span');
                span1.classList.add('red'); 
                span1.textContent = part.value;
                diffText1.appendChild(span1);
                countDifferences1++;
            } else {
                const span1 = document.createElement('span');
                span1.classList.add('green'); 
                span1.textContent = part.value; 
                diffText1.appendChild(span1);
    
                const span2 = document.createElement('span');
                span2.classList.add('green'); 
                span2.textContent = part.value; 
                diffText2.appendChild(span2);
            }
        });
    
        diffCount1.textContent = `Diferencias encontradas Texto 1: ${countDifferences1}`;
        diffCount2.textContent = `Diferencias encontradas Texto 2: ${countDifferences2}`;
    };
    
    cleanBtn.addEventListener('click', (event) => {
        event.preventDefault(); 
        inputText1.value = ''; 
        inputText2.value = '';
        formattedText1.textContent = '';
        formattedText2.textContent = '';  
        diffText1.textContent = '';
        diffText2.textContent = '';
        diffCount1.textContent = '';
        diffCount2.textContent = '';
    });
});
