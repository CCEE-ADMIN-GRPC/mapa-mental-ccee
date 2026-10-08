# Mapa mental — proxy de ensemble para Continue

Servidor local compatível com o endpoint de chat da OpenAI que consulta OpenAI, Gemini e Anthropic em paralelo e pede ao modelo OpenAI para sintetizar uma única resposta.

## Executar

1. Instale Python 3.11 ou superior.
2. Crie e ative um ambiente virtual:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

3. Instale dependências: `pip install -r requirements.txt`.
4. Revise os nomes dos modelos no `.env.local` se sua conta usar IDs diferentes.
5. Inicie o proxy: `uvicorn ensemble_server:app --host 127.0.0.1 --port 8000`.
6. No Continue, selecione **Ensemble local (OpenAI + Gemini + Anthropic)**.

O serviço escuta somente em `127.0.0.1`. Não exponha essa porta à rede. As chaves permanecem no `.env.local`, que é ignorado pelo Git. Cada solicitação executa até três propostas e uma chamada adicional de síntese; os provedores cobram conforme o uso e a conta de cada um.

O MVP converte o histórico em texto para os provedores. Imagens e outros blocos multimodais não são encaminhados.
