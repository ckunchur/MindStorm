import streamlit as st
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import OpenAI
from langchain_community.callbacks import get_openai_callback
from langchain.text_splitter import RecursiveCharacterTextSplitter

def main():
    try:
        openai_api_key = st.secrets["OPENAI_API_KEY"]
    except KeyError:
        with st.sidebar:
            openai_api_key = st.text_input("OpenAI API Key", key="journal_api_key", type="password")
    
    client = OpenAI(api_key=openai_api_key)

    
    st.title("Q&A with RAG")
    st.write("Tutorials used: https://github.com/alejandro-ao/langchain-ask-pdf/blob/main/app.py \n https://docs.mistral.ai/guides/basic-RAG/")
    
    st.write("Here are some demo journal entries that you can try if you don't have your own:")
    # Button to download example demo journal entries 
    file_path = 'pages/generatedjournal.txt'
    with open(file_path, "rb") as file:
        btn = st.download_button(
                label="Download demo journal entries",
                data=file,
                file_name="generatedjournal.txt",
                help="Click to download demo journal entries txt file"
            )
    # upload file
    file = st.file_uploader("Upload your PDF or TXT file of journal entries. This could be an export from other journalling apps, like Day One. If multiple entries, make sure journal entries have the date for better results.", type=["pdf", "txt"])
    
    # Extract the text based on file type
    if file is not None:
      text = ""
      if file.type == "application/pdf":
          pdf_reader = PdfReader(file)
          for page in pdf_reader.pages:
            text += page.extract_text()
      elif file.type == "text/plain":
          # For a TXT file, directly read the text
          text = str(file.read(), "utf-8")
            
      # split into chunks
      text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=0, separators=[" ", ",", "\n"]
        )
      chunks = text_splitter.split_text(text)
      
      # create embeddings
      embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
      knowledge_base = FAISS.from_texts(chunks, embeddings)
      
      # show user input
      user_question = st.text_input("""Here you can ask any question about the PDF or TXT file. \n For example: "what made me happy or sad according to my journal entries?" """)
      if user_question:
        docs = knowledge_base.similarity_search(user_question)
        
        llm = OpenAI(openai_api_key=openai_api_key)
        chain = load_qa_chain(llm, chain_type="stuff")
        with get_openai_callback() as cb:
          response = chain.run(input_documents=docs, question=user_question)
          print(cb)
           
        st.write(response)
    

if __name__ == '__main__':
    main()