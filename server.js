const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Para lidar com upload de arquivos

const app = express();
const port = 3000; // Ou outra porta de sua preferência

// Configura o CORS para permitir requisições do frontend
app.use(cors());
// Habilita o Express para parsear JSON no corpo das requisições (se necessário para outras rotas)
app.use(express.json());

// Configura o Multer para armazenar o arquivo em memória temporariamente
const upload = multer();

// Rota para a API de frequência
app.post('/api/frequencia', upload.single('transcriptFile'), (req, res) => {
    // 'transcriptFile' deve ser o nome do campo 'name' no input de arquivo do seu formulário HTML

    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const transcriptContent = req.file.buffer.toString('utf8');
    console.log('Conteúdo da transcrição recebido:', transcriptContent.substring(0, 200) + '...'); // Log dos primeiros 200 caracteres

    // *** Lógica para extrair nomes da transcrição ***
    // Esta é a parte crucial que você precisará refinar.
    // O Google Meet geralmente formata as transcrições com o nome seguido por um horário.
    // Ex: "Nome do Aluno (10:05:30) Fala do aluno..."

    const extractedNames = [];
    const lines = transcriptContent.split('\n');

    lines.forEach(line => {
        // Regex para capturar o nome antes do parêntese com o horário
        const match = line.match(/^([A-Za-zÀ-ÿ\s]+)\s*\(\d{2}:\d{2}:\d{2}\)/);
        if (match && match[1]) {
            const name = match[1].trim();
            if (name && !extractedNames.includes(name)) { // Adiciona se não estiver vazio e não for duplicado
                extractedNames.push(name);
            }
        }
    });

    // Ordenar os nomes alfabeticamente
    extractedNames.sort((a, b) => a.localeCompare(b));

    res.json({
        success: true,
        message: 'Nomes extraídos com sucesso!',
        data: extractedNames
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});