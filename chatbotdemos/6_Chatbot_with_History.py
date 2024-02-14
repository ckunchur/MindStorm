from openai import OpenAI
import streamlit as st

st.title("ChatGPT-like clone")
st.write("Tutorial: https://docs.streamlit.io/knowledge-base/tutorials/build-conversational-apps. This is a basic chat app, it appends each user and ai input to a chat history.")

try:
    openai_api_key = st.secrets["OPENAI_API_KEY"]
except KeyError:
    with st.sidebar:
        openai_api_key = st.text_input("OpenAI API Key", key="journal_api_key", type="password")
client = OpenAI(api_key=openai_api_key)

        
st.write("""
         ### Print Chat History 
         
         I couldn't put this button at the bottom of the page so it is here. Click this button at the end of the chat to see the chat history and how it would be saved in our database.""")
if st.button('Print Chat History'):
    for msg in st.session_state.messages:
        st.write(f"{msg['role'].capitalize()}: {msg['content']}")
        
st.write("""
         ### Chat interface
         # """)       
if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-3.5-turbo"

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("What is up?"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        stream = client.chat.completions.create(
            model=st.session_state["openai_model"],
            messages=[
                {"role": m["role"], "content": m["content"]}
                for m in st.session_state.messages
            ],
            stream=True,
        )
        response = st.write_stream(stream)
    st.session_state.messages.append({"role": "assistant", "content": response})
    
