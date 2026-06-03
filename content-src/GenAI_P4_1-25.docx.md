  
**Generative AI \+ RAG \+ Agents**

Interview Study Guide

Phase 4  ·  Topics 1–25 of 75

Full-Stack \+ GenAI Roadmap

Code language: Python

**How to run the code samples**

API code: runs with Python \+ the listed packages (openai, langchain, chromadb, etc.) and a valid API key where required.

Logic demos: save as filename.py, then run  python3 filename.py

**Table of Contents**

# **Generative AI \+ RAG \+ Agents**

This guide covers the first 25 topics of Phase 4, the foundations of working with Generative AI: what generative AI and LLMs are, how tokens and context windows work, hallucinations and AI memory, the full breadth of prompt engineering (system/user prompts, zero/few-shot, chain-of-thought, the ReAct pattern), the key generation parameters (temperature, top\_p, top\_k, max\_tokens, frequency and presence penalties), and the building blocks of LLM applications (structured outputs/JSON mode, output parsers, streaming, function and tool calling) ending with embeddings and vectorization.

Each topic follows the same structure: a plain-English explanation, the same idea in spoken Hinglish, key interview points, a real-world example, full Python code, a Python-runnable logic demo with verified expected output, and common follow-up questions. For topics that require a live LLM API, the code shows the real, idiomatic implementation (with openai / langchain / etc.) and the demo verifies the underlying logic in plain Python so the output is reproducible without an API key.

## **1\. What is Generative AI**

**Simple Explanation**

Generative AI is a class of models that create new content — text, images, audio, code, video — rather than just analyzing or labeling existing data. Given a prompt, the model produces novel output that resembles its training data but isn't copied from it.

This contrasts with traditional (discriminative) machine learning, which classifies or scores existing inputs (spam vs not-spam, cat vs dog). Generative models learn the underlying patterns of data well enough to synthesize plausible new examples. Modern generative AI is powered by large neural networks like LLMs (for text) and diffusion models (for images).

**Hinglish Explanation**

Generative AI models ki ek class hai jo naya content banati hai — text, images, audio, code, video — sirf existing data analyze ya label karne ke bajaye. Ek prompt par, model novel output produce karta hai jo training data jaisa hota hai par usse copy nahi hota.

Ye traditional (discriminative) machine learning ke ulta hai, jo existing inputs ko classify ya score karta hai (spam vs not-spam, cat vs dog). Generative models data ke underlying patterns itne achhe se seekhte hain ki plausible naye examples bana sakein. Modern generative AI bade neural networks se chalti hai jaise LLMs (text ke liye) aur diffusion models (images ke liye).

**Key Interview Points**

* Creates new content (text/image/audio/code), not just labels existing data.

* Contrasts with discriminative ML, which classifies or scores inputs.

* Learns data patterns well enough to synthesize plausible new examples.

* Powered by large neural nets: LLMs (text), diffusion models (images).

* Output is novel and probabilistic — the same prompt can yield different results.

**Real-World Example**

A marketing team uses generative AI to draft ad copy, generate product images, and write code snippets — producing brand-new material from short prompts. A spam filter, by contrast, is discriminative: it only labels existing emails, it doesn't write new ones.

**Code — Full & Runnable (Python)**

*Real OpenAI Python SDK code (needs an API key). The Python-runnable demo below contrasts a generative model with a discriminative one so the core idea is verifiable here.*

\# What is Generative AI — calling a generative model with the OpenAI Python SDK.  
from openai import OpenAI  
   
client \= OpenAI()  \# reads OPENAI\_API\_KEY from the environment  
   
\# A generative model CREATES new content from a prompt (text here; could be image/audio/code).  
response \= client.chat.completions.create(  
    model="gpt-4o-mini",  
    messages=\[{"role": "user", "content": "Write a two-line poem about the ocean."}\],  
)  
print(response.choices\[0\].message.content)  
   
\# Generative AI (LLMs, diffusion models, etc.) generates novel output rather than just  
\# classifying or scoring existing data the way traditional (discriminative) ML does.

**Test / Demo & Expected Output (Python-runnable)**

\# What is Generative AI — generative (creates new data) vs discriminative (labels data)  
import random  
random.seed(7)  
   
\# A tiny generative model: a Markov chain that GENERATES new text it never saw verbatim.  
corpus \= "the cat sat on the mat the cat ate the fish the dog sat on the rug".split()  
chain \= {}  
for a, b in zip(corpus, corpus\[1:\]):  
    chain.setdefault(a, \[\]).append(b)  
   
def generate(start, n):  
    word, out \= start, \[start\]  
    for \_ in range(n):  
        nxt \= chain.get(word)  
        if not nxt: break  
        word \= random.choice(nxt); out.append(word)  
    return " ".join(out)  
   
\# A discriminative model: classifies existing input (does NOT create new data).  
def classify(sentence):  
    return "about pets" if any(w in sentence for w in ("cat", "dog", "fish")) else "other"  
   
generated \= generate("the", 6\)  
print("Generative output:", generated)  
print("Discriminative label:", classify(generated))  
assert len(generated.split()) \> 1, "model generated a new sequence"  
assert classify("the cat sat") \== "about pets"  
print("Generative AI creates new content (text/image/audio); discriminative AI labels existing content.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Generative output: the cat sat on the cat sat  
\# Discriminative label: about pets  
\# Generative AI creates new content (text/image/audio); discriminative AI labels existing content.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: How is generative AI different from traditional ML?**

A: Traditional (discriminative) ML predicts a label or value for existing input (classification/regression). Generative AI produces new content that resembles its training distribution — it synthesizes rather than just categorizes.

**Q: What are the main types of generative models?**

A: For text, large language models (transformers); for images, diffusion models (and earlier GANs/VAEs); plus multimodal models that handle several modalities. They all learn to generate data similar to what they were trained on.

**Q: Why is generative AI output non-deterministic?**

A: Generation samples from a probability distribution over possible outputs, so the same prompt can produce different results — especially at higher temperature/top\_p settings.

## **2\. What is an LLM**

**Simple Explanation**

A Large Language Model (LLM) is a very large neural network — typically a transformer with billions of parameters — trained on massive amounts of text to predict the next token given the preceding text. By repeatedly predicting and appending the next token, it generates fluent, coherent language.

Through training on web-scale data, LLMs absorb grammar, facts, reasoning patterns, and styles, letting them answer questions, write, summarize, translate, and code. They don't 'look up' answers; they generate them token by token from learned statistical patterns. Examples include GPT, Claude, Gemini, and Llama.

**Hinglish Explanation**

Large Language Model (LLM) ek bahut bada neural network hai — aksar billions parameters waala transformer — jo bahut saare text par train hota hai taaki preceding text ke aadhaar par next token predict kare. Baar-baar next token predict aur append karke, ye fluent, coherent language generate karta hai.

Web-scale data par training se, LLMs grammar, facts, reasoning patterns aur styles absorb karte hain, jisse wo questions answer kar sakte hain, likh sakte hain, summarize, translate aur code kar sakte hain. Wo answers 'look up' nahi karte; wo unhe token by token learned statistical patterns se generate karte hain. Examples: GPT, Claude, Gemini, Llama.

**Key Interview Points**

* A huge transformer neural net trained to predict the next token.

* Generates text one token at a time, feeding output back as input.

* Learns grammar, facts, reasoning, and style from web-scale training data.

* Doesn't retrieve answers — it generates them from learned patterns.

* Examples: GPT, Claude, Gemini, Llama (varying sizes and capabilities).

**Real-World Example**

When you ask ChatGPT a question, the LLM predicts the most likely next token over and over, building the answer word-piece by word-piece — the same mechanism whether it's writing a poem, fixing code, or explaining a concept.

**Code — Full & Runnable (Python)**

*Real OpenAI SDK code (needs an API key). The Python-runnable demo below implements next-token prediction from learned probabilities so the core mechanism is verifiable here.*

\# What is an LLM — a Large Language Model predicts the next token, repeatedly.  
from openai import OpenAI  
   
client \= OpenAI()  
   
\# Under the hood the model assigns probabilities to the next token and samples one,  
\# then feeds it back in and repeats — that loop produces fluent text.  
response \= client.chat.completions.create(  
    model="gpt-4o-mini",  
    messages=\[  
        {"role": "system", "content": "You are a concise assistant."},  
        {"role": "user", "content": "Explain what an LLM is in one sentence."},  
    \],  
)  
print(response.choices\[0\].message.content)  
print("Tokens used:", response.usage.total\_tokens)  
   
\# LLMs (GPT, Claude, Llama, ...) are transformer neural networks with billions of  
\# parameters trained on massive text corpora to predict the next token.

**Test / Demo & Expected Output (Python-runnable)**

\# What is an LLM — at its core, next-token prediction over learned probabilities  
from collections import defaultdict, Counter  
text \= "i love ml i love ai i love coding i love data".split()  
\# Learn P(next | current) from data (a 1-gram language model)  
model \= defaultdict(Counter)  
for a, b in zip(text, text\[1:\]):  
    model\[a\]\[b\] \+= 1  
   
def predict\_next(word):  
    counts \= model\[word\]  
    total \= sum(counts.values())  
    probs \= {w: c / total for w, c in counts.items()}  
    best \= max(probs, key=probs.get)  
    return best, probs  
   
best, probs \= predict\_next("love")  
print("After 'love', distribution:", {k: round(v, 2\) for k, v in probs.items()})  
print("Most likely next token:", best)  
assert abs(sum(probs.values()) \- 1.0) \< 1e-9, "probabilities sum to 1"  
print("An LLM is a huge neural network trained to predict the next token; text is generated one token at a time.")  
print("Real LLMs learn billions of parameters over web-scale text; this is the same idea at toy scale.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# After 'love', distribution: {'ml': 0.25, 'ai': 0.25, 'coding': 0.25, 'data': 0.25}  
\# Most likely next token: ml  
\# An LLM is a huge neural network trained to predict the next token; text is generated one token at a time.  
\# Real LLMs learn billions of parameters over web-scale text; this is the same idea at toy scale.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What does 'large' mean in LLM?**

A: It refers to the model's scale — billions (sometimes trillions) of parameters — and the enormous training corpus. Scale is a key reason these models exhibit broad, flexible capabilities.

**Q: Do LLMs store and look up facts?**

A: Not like a database. Knowledge is encoded implicitly in the weights, and answers are generated token by token. That's why they can be wrong or outdated — and why retrieval (RAG) is used to ground them in real sources.

**Q: What architecture do modern LLMs use?**

A: The transformer, which uses self-attention to weigh relationships between tokens across the context. It's what made training such large, capable language models practical.

## **3\. Tokens**

**Simple Explanation**

LLMs don't read characters or whole words — they process tokens, which are subword units produced by a tokenizer (commonly using Byte-Pair Encoding). A token may be a whole word, part of a word, a space, or punctuation. Common words are often single tokens; rare or long words split into several.

Tokens matter practically because both context limits and pricing are measured in tokens, not words or characters. A rough English rule of thumb is \~4 characters or \~0.75 words per token. Knowing this lets you estimate costs and ensure prompts fit within the model's context window.

**Hinglish Explanation**

LLMs characters ya poore words nahi padhte — wo tokens process karte hain, jo subword units hain ek tokenizer se bane (aksar Byte-Pair Encoding use karke). Ek token poora word, word ka part, space, ya punctuation ho sakta hai. Common words aksar single tokens hote hain; rare ya lambe words kai mein split hote hain.

Tokens practically matter karte hain kyunki context limits aur pricing dono tokens mein measure hote hain, words ya characters mein nahi. Ek rough English rule hai \~4 characters ya \~0.75 words per token. Ye jaan kar aap costs estimate kar sakte ho aur ensure kar sakte ho ki prompts model ke context window mein fit hon.

**Key Interview Points**

* LLMs process tokens (subword units), not raw characters or words.

* Tokenizers use schemes like Byte-Pair Encoding (BPE).

* Common words \= one token; rare/long words split into multiple.

* Context limits AND pricing are measured in tokens.

* Rule of thumb: \~4 characters / \~0.75 words per token (English).

**Real-World Example**

Estimating the cost of summarizing a 10-page document: you count its tokens with tiktoken (say \~6,000) rather than its words, because the API bills per token and you must confirm input \+ output fit the model's token limit.

**Code — Full & Runnable (Python)**

*Real tiktoken code (OpenAI's tokenizer). The Python-runnable demo below approximates subword tokenization so the token-vs-word idea is verifiable here.*

\# Tokens — count tokens precisely with the tiktoken library (OpenAI's tokenizer).  
import tiktoken  
   
enc \= tiktoken.encoding\_for\_model("gpt-4o-mini")  
   
def count\_tokens(text: str) \-\> int:  
    return len(enc.encode(text))  
   
samples \= \["Hello world\!", "Tokenization", "internationalization"\]  
for s in samples:  
    ids \= enc.encode(s)  
    print(f"{s\!r}: {len(ids)} tokens \-\> ids {ids}")  
   
\# Tokens drive both cost and context limits. A rough rule: \~4 characters or  
\# \~0.75 words per token in English. Always budget prompts in tokens, not words.  
prompt \= "Summarize the following article in three bullet points."  
print("Prompt token count:", count\_tokens(prompt))

**Test / Demo & Expected Output (Python-runnable)**

\# Tokens — text is split into tokens (subword units), not words; \~4 chars/token (English)  
def approx\_tokenize(text):  
    \# A rough word/subword splitter for intuition (real tokenizers use BPE).  
    import re  
    pieces \= re.findall(r"\\w+|\[^\\w\\s\]", text)  
    tokens \= \[\]  
    for p in pieces:  
        \# split long words into \~4-char subword chunks (BPE-like intuition)  
        for i in range(0, len(p), 4):  
            tokens.append(p\[i:i+4\])  
    return tokens  
   
samples \= \["Hello world\!", "Tokenization", "GPT models are powerful."\]  
for s in samples:  
    toks \= approx\_tokenize(s)  
    print(f"{s\!r}: {len(toks)} tokens, {len(s.split())} words \-\> {toks}")  
   
text \= "internationalization"  
toks \= approx\_tokenize(text)  
print(f"\\nOne long word {text\!r} \= {len(toks)} tokens (token count \!= word count)")  
est \= len("Hello world\!") / 4  
print(f"Rule of thumb: \~4 chars per token, so 'Hello world\!' \~= {est:.0f} tokens")  
assert len(toks) \> 1, "a long word becomes multiple tokens"  
print("Tokens matter: pricing and context limits are measured in tokens, not words or characters.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# 'Hello world\!': 5 tokens, 2 words \-\> \['Hell', 'o', 'worl', 'd', '\!'\]  
\# 'Tokenization': 3 tokens, 1 words \-\> \['Toke', 'niza', 'tion'\]  
\# 'GPT models are powerful.': 7 tokens, 4 words \-\> \['GPT', 'mode', 'ls', 'are', 'powe', 'rful', '.'\]  
\#   
\# One long word 'internationalization' \= 5 tokens (token count \!= word count)  
\# Rule of thumb: \~4 chars per token, so 'Hello world\!' \~= 3 tokens  
\# Tokens matter: pricing and context limits are measured in tokens, not words or characters.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why do models use tokens instead of words?**

A: Subword tokenization handles any text — including rare words, typos, and other languages — with a fixed vocabulary, balancing vocabulary size against sequence length. Pure word-level vocabularies would be huge and brittle.

**Q: How do tokens relate to cost and limits?**

A: APIs price per token (input and output), and the context window is a token budget. So you estimate and optimize in tokens, not words — e.g., trimming prompts to fit and control cost.

**Q: Is token count the same as word count?**

A: No. A long word can be several tokens, and punctuation/spaces count too. Roughly 100 tokens ≈ 75 English words, but it varies by text and language.

## **4\. Context window**

**Simple Explanation**

The context window is the maximum number of tokens an LLM can consider at once — it includes everything: the system prompt, conversation history, the user's input, AND the space reserved for the model's output. If the total exceeds the window, something must be dropped or the request fails.

Window sizes vary by model (from a few thousand to hundreds of thousands of tokens). Because the model can only 'see' what's in the window, long conversations or large documents require strategies: truncate or summarize old turns, or retrieve only the relevant pieces (RAG) instead of stuffing everything in.

**Hinglish Explanation**

Context window wo maximum number of tokens hai jo ek LLM ek saath consider kar sakta hai — isme sab kuch shamil hai: system prompt, conversation history, user ka input, AUR model ke output ke liye reserved space. Agar total window se zyada ho, to kuch drop karna padta hai ya request fail hoti hai.

Window sizes model ke hisaab se alag hote hain (kuch hazaar se hundreds of thousands tokens tak). Kyunki model sirf wahi 'dekh' sakta hai jo window mein hai, lambi conversations ya bade documents ke liye strategies chahiye: purane turns truncate ya summarize karo, ya sirf relevant pieces retrieve karo (RAG) sab kuch thoosne ke bajaye.

**Key Interview Points**

* Max tokens the model can attend to at once — the model's 'working memory'.

* Includes system prompt \+ history \+ user input \+ reserved output space.

* Exceeding it forces truncation, summarization, or an error.

* Sizes vary widely by model (thousands to hundreds of thousands of tokens).

* Long chats/docs need truncation, summary memory, or retrieval (RAG).

**Real-World Example**

A chatbot in a long support conversation eventually exceeds its context window. The app keeps the system prompt and the last several turns, summarizes or drops older ones, and uses retrieval to pull only relevant past details — so the model always has room to respond.

**Code — Full & Runnable (Python)**

*Real tiktoken-based budgeting code. The Python-runnable demo below simulates a sliding context window so the truncation behavior is verifiable here.*

\# Context window — fit system \+ history \+ input \+ expected output within the limit.  
import tiktoken  
   
enc \= tiktoken.encoding\_for\_model("gpt-4o-mini")  
MODEL\_CONTEXT \= 128\_000   \# example model context size (tokens)  
RESERVE\_FOR\_OUTPUT \= 1\_000  
   
def tokens(text): return len(enc.encode(text))  
   
def fit\_history(system, history, user, max\_ctx=MODEL\_CONTEXT):  
    budget \= max\_ctx \- RESERVE\_FOR\_OUTPUT \- tokens(system) \- tokens(user)  
    kept \= \[\]  
    \# Keep the most recent turns that fit (drop oldest first).  
    for msg in reversed(history):  
        t \= tokens(msg\["content"\])  
        if budget \- t \< 0:  
            break  
        budget \-= t  
        kept.insert(0, msg)  
    return \[{"role": "system", "content": system}, \*kept, {"role": "user", "content": user}\]  
   
\# When a conversation grows beyond the window you must truncate, summarize older  
\# turns, or retrieve only the relevant context (RAG) instead of sending everything.

**Test / Demo & Expected Output (Python-runnable)**

\# Context window — the model can only "see" a fixed number of tokens at once  
def count\_tokens(text):  \# toy: \~1 token per 4 chars  
    return max(1, len(text) // 4\)  
   
class ContextWindow:  
    def \_\_init\_\_(self, max\_tokens):  
        self.max\_tokens \= max\_tokens  
        self.messages \= \[\]  
    def add(self, role, content):  
        self.messages.append({"role": role, "content": content, "tokens": count\_tokens(content)})  
        self.\_truncate()  
    def \_truncate(self):  
        \# Drop oldest messages when over budget (sliding window)  
        while sum(m\["tokens"\] for m in self.messages) \> self.max\_tokens and len(self.messages) \> 1:  
            self.messages.pop(0)  
    def total(self):  
        return sum(m\["tokens"\] for m in self.messages)  
   
ctx \= ContextWindow(max\_tokens=20)  
for i in range(8):  
    ctx.add("user", "This is message number " \+ str(i) \+ " with some words")  
print("Window budget: 20 tokens | current usage:", ctx.total())  
print("Messages still in context:", len(ctx.messages), "(oldest were dropped)")  
assert ctx.total() \<= 20, "never exceeds the context window"  
print("If a conversation exceeds the context window, you must truncate, summarize, or use retrieval.")  
print("Everything the model 'knows' for a reply must fit in the window: system \+ history \+ input \+ output.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Window budget: 20 tokens | current usage: 20  
\# Messages still in context: 2 (oldest were dropped)  
\# If a conversation exceeds the context window, you must truncate, summarize, or use retrieval.  
\# Everything the model 'knows' for a reply must fit in the window: system \+ history \+ input \+ output.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What counts against the context window?**

A: Everything sent and generated: the system prompt, all prior messages you include, the current user input, and the tokens the model produces as output — all must fit within the limit.

**Q: What happens when a conversation exceeds the window?**

A: You must reduce what you send — truncate or summarize old turns, or retrieve only relevant context (RAG). Otherwise the oldest context is dropped or the API rejects the request.

**Q: Does a bigger context window solve everything?**

A: It helps, but stuffing huge contexts increases cost and latency and can dilute relevance ('lost in the middle'). Retrieval of only relevant chunks is often better than maximizing raw context.

## **5\. Hallucinations**

**Simple Explanation**

A hallucination is when an LLM produces output that is fluent and confident but factually wrong or entirely made up — invented citations, nonexistent APIs, incorrect dates. It happens because the model generates statistically plausible text rather than retrieving verified facts, and it has no built-in sense of truth.

Hallucinations are more likely on niche topics, recent events beyond training, or when pushed to answer something it doesn't know. Mitigations include grounding the model with retrieved context (RAG), asking it to cite sources, lowering temperature, and explicitly allowing it to say 'I don't know' instead of guessing.

**Hinglish Explanation**

Hallucination tab hota hai jab ek LLM aisa output deta hai jo fluent aur confident hota hai par factually galat ya poori tarah banaya hua — invented citations, nonexistent APIs, galat dates. Ye isliye hota hai kyunki model verified facts retrieve karne ke bajaye statistically plausible text generate karta hai, aur uska koi built-in sense of truth nahi hota.

Hallucinations niche topics, training ke baad ke recent events, ya jab kuch na jaanne par bhi answer karne ko push kiya jaaye, tab zyada likely hote hain. Mitigations: model ko retrieved context se ground karna (RAG), sources cite karne ko kehna, temperature kam karna, aur explicitly use 'I don't know' kehne dena guess karne ke bajaye.

**Key Interview Points**

* Fluent, confident output that is factually wrong or fabricated.

* Caused by generating plausible text, not retrieving verified facts.

* More likely on niche/recent topics or when forced to answer.

* Mitigate with grounding (RAG), source citations, and low temperature.

* Let the model abstain ('I don't know') instead of guessing.

**Real-World Example**

Asked for case law it doesn't know, an ungrounded model can invent realistic-looking but fake court citations. Grounding it with a real legal database (RAG) and instructing it to answer only from retrieved documents — or say it doesn't know — prevents the fabrication.

**Code — Full & Runnable (Python)**

*Real OpenAI grounding code (needs an API key). The Python-runnable demo below contrasts ungrounded fabrication with grounded retrieval so the effect is verifiable here.*

\# Hallucinations — reduce them with grounding, low temperature, and an "I don't know" out.  
from openai import OpenAI  
   
client \= OpenAI()  
   
def grounded\_answer(question: str, context: str) \-\> str:  
    \# Force the model to answer ONLY from provided context (RAG-style grounding).  
    system \= (  
        "Answer using ONLY the provided context. "  
        "If the answer is not in the context, say 'I don't know.' Do not make anything up."  
    )  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        temperature=0,   \# lower temperature \-\> less creative fabrication  
        messages=\[  
            {"role": "system", "content": system},  
            {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {question}"},  
        \],  
    )  
    return response.choices\[0\].message.content  
   
\# Hallucination \= confident but false output. Mitigations: ground with retrieved  
\# context, cite sources, lower temperature, and allow the model to abstain.

**Test / Demo & Expected Output (Python-runnable)**

\# Hallucinations — models can answer confidently even when they don't know  
knowledge \= {"capital of france": "Paris", "author of hamlet": "Shakespeare"}  
   
def ungrounded\_answer(q):  
    \# Without grounding, a model may "fill in" a plausible-but-wrong answer.  
    return knowledge.get(q.lower(), "Atlantis (confidently fabricated\!)")  
   
def grounded\_answer(q, retrieved):  
    \# With retrieval, answer only from provided context; otherwise admit ignorance.  
    return retrieved.get(q.lower(), "I don't have information on that.")  
   
print("Ungrounded, known:  ", ungrounded\_answer("Capital of France"))  
print("Ungrounded, unknown:", ungrounded\_answer("Capital of Wakanda"))   \# hallucinates  
print("Grounded, unknown:  ", grounded\_answer("Capital of Wakanda", knowledge))  \# safe  
assert ungrounded\_answer("Capital of Wakanda") \!= "I don't have information on that."  
assert grounded\_answer("Capital of Wakanda", knowledge) \== "I don't have information on that."  
print("Hallucination \= fluent, confident output that is factually wrong or made up.")  
print("Mitigations: grounding via RAG, citing sources, lower temperature, and asking the model to say 'I don't know'.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Ungrounded, known:   Paris  
\# Ungrounded, unknown: Atlantis (confidently fabricated\!)  
\# Grounded, unknown:   I don't have information on that.  
\# Hallucination \= fluent, confident output that is factually wrong or made up.  
\# Mitigations: grounding via RAG, citing sources, lower temperature, and asking the model to say 'I don't know'.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why do LLMs hallucinate?**

A: They generate the most statistically plausible continuation, not verified truth. With no grounding and no built-in fact-checking, gaps get filled with confident-sounding but fabricated content.

**Q: How do you reduce hallucinations?**

A: Ground responses in retrieved sources (RAG), require citations, lower the temperature, constrain the task, and explicitly permit 'I don't know'. Verification/guardrails on outputs help too.

**Q: Can hallucinations be eliminated completely?**

A: Not entirely with current models, but they can be greatly reduced. Grounding, careful prompting, and output validation make hallucinations rare enough for many production uses.

## **6\. AI memory**

**Simple Explanation**

LLM API calls are stateless: the model remembers nothing between requests. 'Memory' in an AI app is an illusion the application creates by storing the conversation and resending the relevant history with each new call, so the model has the context it needs to stay coherent.

Because history consumes tokens, long conversations need memory strategies: send the full history (simple, but grows), a sliding window of recent turns, a running summary of older turns, or vector-store memory that retrieves only relevant past messages. Choosing the right strategy balances coherence, cost, and the context-window limit.

**Hinglish Explanation**

LLM API calls stateless hain: model requests ke beech kuch yaad nahi rakhta. AI app mein 'memory' ek illusion hai jo application banati hai conversation store karke aur har nayi call ke saath relevant history dobara bhej kar, taaki model ke paas coherent rehne ke liye zaroori context ho.

Kyunki history tokens consume karti hai, lambi conversations ko memory strategies chahiye: poori history bhejo (simple, par badhti hai), recent turns ka sliding window, purane turns ka running summary, ya vector-store memory jo sirf relevant past messages retrieve kare. Sahi strategy choose karna coherence, cost aur context-window limit ko balance karta hai.

**Key Interview Points**

* LLM calls are stateless — no memory between requests.

* Apps fake memory by storing and resending conversation history.

* History costs tokens, so long chats need a memory strategy.

* Strategies: full history, sliding window, summary memory, vector-store memory.

* Choice trades off coherence vs cost vs context-window limits.

**Real-World Example**

A chatbot remembers your name across a session not because the model stores it, but because the app keeps the conversation and resends earlier turns. For very long chats it summarizes old messages and retrieves relevant snippets so memory survives within the token budget.

**Code — Full & Runnable (Python)**

*Real OpenAI conversation code (needs an API key). The Python-runnable demo below shows stateless vs history-passing calls so memory behavior is verifiable here.*

\# AI memory — LLMs are stateless; persist and resend conversation history yourself.  
from openai import OpenAI  
   
client \= OpenAI()  
   
class Conversation:  
    def \_\_init\_\_(self, system: str):  
        self.messages \= \[{"role": "system", "content": system}\]  
   
    def ask(self, user\_message: str) \-\> str:  
        self.messages.append({"role": "user", "content": user\_message})  
        response \= client.chat.completions.create(  
            model="gpt-4o-mini", messages=self.messages,  
        )  
        reply \= response.choices\[0\].message.content  
        self.messages.append({"role": "assistant", "content": reply})  \# remember the turn  
        return reply  
   
\# Because the API has no memory between calls, the app stores history and resends it.  
\# For long chats, use a sliding window, a running summary, or vector-store memory.  
chat \= Conversation("You are a helpful assistant.")  
\# chat.ask("My name is Asha"); chat.ask("What is my name?")  \# remembers across turns

**Test / Demo & Expected Output (Python-runnable)**

\# AI memory — LLM calls are stateless; "memory" means resending prior turns  
def llm(messages):  \# toy stand-in: echoes awareness of history length  
    user\_turns \= \[m for m in messages if m\["role"\] \== "user"\]  
    last \= user\_turns\[-1\]\["content"\]  
    if "my name is" in last.lower():  
        return "Nice to meet you\!"  
    if "what is my name" in last.lower():  
        \# Can only know if the earlier turn is included in 'messages'  
        for m in messages:  
            if "my name is" in m\["content"\].lower():  
                return "Your name is " \+ m\["content"\].split("is")\[-1\].strip()  
        return "I don't know your name."  
    return "ok"  
   
\# Stateless: each call without history forgets everything  
print("No memory:", llm(\[{"role": "user", "content": "What is my name?"}\]))  
\# With memory: prior turns are resent as context  
history \= \[  
    {"role": "user", "content": "My name is Asha"},  
    {"role": "assistant", "content": "Nice to meet you\!"},  
    {"role": "user", "content": "What is my name?"},  
\]  
print("With memory:", llm(history))  
assert llm(history) \== "Your name is Asha"  
print("LLMs have no built-in memory between calls; apps store conversation history and resend it.")  
print("Strategies: full history, sliding window, summary memory, or vector-store (retrieval) memory.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# No memory: I don't know your name.  
\# With memory: Your name is Asha  
\# LLMs have no built-in memory between calls; apps store conversation history and resend it.  
\# Strategies: full history, sliding window, summary memory, or vector-store (retrieval) memory.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Do LLMs have memory between API calls?**

A: No — each call is independent. The application provides 'memory' by persisting the conversation and including the needed history in the next request's messages.

**Q: What are common memory strategies?**

A: Full conversation history (simple but token-heavy), a sliding window of recent turns, summarizing older turns into a compact note, and vector-store memory that retrieves only relevant past messages.

**Q: Why not just always send the entire history?**

A: It grows unbounded, increasing cost and latency, and eventually overflows the context window. Windowing, summarizing, or retrieval keeps memory effective without exceeding limits.

## **7\. Prompt Engineering**

**Simple Explanation**

Prompt engineering is the practice of crafting inputs to get reliable, high-quality outputs from an LLM. Since the model's behavior depends heavily on how you ask, good prompts provide role/context, state the task specifically, define the desired output format, and often include examples.

Key techniques include assigning a role ('You are an expert...'), giving clear constraints, specifying structure (JSON, bullet list, length), showing few-shot examples, and asking for step-by-step reasoning when needed. It's iterative: you test, observe failures, and refine. Strong prompting often beats more complex solutions for getting consistent results.

**Hinglish Explanation**

Prompt engineering inputs craft karne ki practice hai taaki LLM se reliable, high-quality outputs milein. Kyunki model ka behavior is par bahut depend karta hai ki aap kaise poochhte ho, achhe prompts role/context dete hain, task specifically batate hain, desired output format define karte hain, aur aksar examples include karte hain.

Key techniques: role assign karna ('You are an expert...'), clear constraints dena, structure specify karna (JSON, bullet list, length), few-shot examples dikhana, aur zaroorat par step-by-step reasoning maangna. Ye iterative hai: aap test karte ho, failures observe karte ho, aur refine karte ho. Strong prompting aksar consistent results ke liye zyada complex solutions se behtar hoti hai.

**Key Interview Points**

* Crafting inputs to reliably get high-quality LLM outputs.

* Provide role/context, a specific task, and the desired output format.

* Techniques: roles, constraints, examples (few-shot), step-by-step reasoning.

* Iterative: test, observe failures, refine.

* Often beats more complex solutions for consistent results.

**Real-World Example**

Instead of 'tell me about dogs', a product team prompts: 'You are a veterinarian. Give 3 specific care tips for a Labrador puppy as a numbered list, each under 15 words.' The structured, role-based prompt yields consistent, usable output every time.

**Code — Full & Runnable (Python)**

*Real OpenAI prompting code (needs an API key). The Python-runnable demo below scores prompt quality so the difference between vague and engineered prompts is verifiable here.*

\# Prompt Engineering — structure prompts with role, context, task, and format.  
from openai import OpenAI  
   
client \= OpenAI()  
   
def engineered\_prompt(topic: str) \-\> str:  
    system \= "You are an expert technical writer who is clear and concise."  
    user \= f"""Task: Explain "{topic}" to a beginner.  
Constraints:  
\- Use at most 3 sentences.  
\- Avoid jargon; if you must use a term, define it.  
\- End with a one-line analogy.  
Format: plain text, no headings."""  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        messages=\[{"role": "system", "content": system}, {"role": "user", "content": user}\],  
    )  
    return response.choices\[0\].message.content  
   
\# Effective prompts: set a role, give context, state the task precisely, specify the  
\# output format and constraints, and (often) include examples. Iterate and measure.

**Test / Demo & Expected Output (Python-runnable)**

\# Prompt Engineering — clearer, more specific prompts yield better results  
def score\_prompt(prompt):  
    s \= 0  
    if len(prompt) \> 20: s \+= 1                              \# has detail  
    if any(w in prompt.lower() for w in ("specific", "format", "json", "list", "steps")): s \+= 1  \# output spec  
    if "example" in prompt.lower() or "e.g." in prompt.lower(): s \+= 1   \# examples  
    if any(w in prompt.lower() for w in ("you are", "act as", "role")): s \+= 1   \# role/persona  
    if prompt.strip().endswith("?") or ":" in prompt: s \+= 1  \# clear ask  
    return s  
   
vague \= "tell me about dogs"  
good \= ("You are a veterinarian. List 3 specific care tips for a Labrador puppy, "  
        "in a numbered list. Example tip: 'Feed puppy-formula food 3x/day.'")  
print(f"Vague prompt score: {score\_prompt(vague)}/5 \-\> {vague\!r}")  
print(f"Engineered prompt score: {score\_prompt(good)}/5")  
assert score\_prompt(good) \> score\_prompt(vague), "a well-engineered prompt scores higher"  
print("Good prompts: give role/context, be specific, specify output format, and show examples.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Vague prompt score: 0/5 \-\> 'tell me about dogs'  
\# Engineered prompt score: 5/5  
\# Good prompts: give role/context, be specific, specify output format, and show examples.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What makes a prompt effective?**

A: Clarity and specificity: a defined role/context, an explicit task, output-format constraints, and often examples. Vague prompts get vague, inconsistent answers.

**Q: What are common prompt-engineering techniques?**

A: Role assignment, clear constraints, output-format specification, few-shot examples, chain-of-thought ('think step by step'), and decomposition of complex tasks into steps.

**Q: Is prompt engineering a one-time task?**

A: No — it's iterative. You test prompts against real cases, observe failure modes, and refine wording, examples, and structure to improve reliability.

## **8\. System prompts**

**Simple Explanation**

A system prompt is a special, high-priority instruction — usually the first message — that sets the assistant's role, persona, rules, tone, and constraints for the entire conversation. It defines who the assistant is and how it should behave before the user ever speaks.

Unlike a single user turn, the system prompt shapes every response: output format, safety boundaries, domain focus, and style. It's where you encode behavior like 'always answer in JSON', 'decline off-topic questions', or 'act as a senior Python tutor'. A well-crafted system prompt is one of the most powerful levers for controlling an LLM app.

**Hinglish Explanation**

System prompt ek special, high-priority instruction hai — aksar pehla message — jo poori conversation ke liye assistant ka role, persona, rules, tone aur constraints set karta hai. Ye define karta hai assistant kaun hai aur kaise behave kare, user ke bolne se pehle hi.

Ek single user turn ke ulta, system prompt har response ko shape karta hai: output format, safety boundaries, domain focus, aur style. Yahan aap behavior encode karte ho jaise 'hamesha JSON mein answer do', 'off-topic questions decline karo', ya 'senior Python tutor ki tarah act karo'. Ek achha system prompt LLM app control karne ke sabse powerful levers mein se ek hai.

**Key Interview Points**

* A high-priority first instruction setting role, rules, tone, and constraints.

* Applies to the whole conversation, not just one turn.

* Controls persona, output format, safety boundaries, and domain focus.

* Encodes behavior like 'answer in JSON' or 'decline off-topic questions'.

* One of the strongest levers for shaping LLM app behavior.

**Real-World Example**

A customer-support bot's system prompt says: 'You are Acme's support agent. Be polite and concise, answer only from the help docs, never discuss competitors, and escalate billing issues.' Every user message is then handled within those rules — set once, applied throughout.

**Code — Full & Runnable (Python)**

*Real OpenAI system-prompt code (needs an API key). The Python-runnable demo below shows how a system prompt constrains the assistant's persona and format, verifiable here.*

\# System prompts — define persona, rules, and constraints for the whole conversation.  
from openai import OpenAI  
   
client \= OpenAI()  
   
SYSTEM\_PROMPT \= """You are CodeHelper, a senior Python tutor.  
Rules:  
\- Always give a short explanation, then a runnable code example.  
\- Prefer standard library solutions.  
\- If a question is unsafe or off-topic, politely decline.  
\- Keep answers under 150 words."""  
   
def ask(user\_message: str) \-\> str:  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        messages=\[  
            {"role": "system", "content": SYSTEM\_PROMPT},   \# sets behavior for every turn  
            {"role": "user", "content": user\_message},  
        \],  
    )  
    return response.choices\[0\].message.content  
   
\# The system prompt is the highest-level instruction: it shapes tone, role, output  
\# format, and guardrails consistently across the entire conversation.

**Test / Demo & Expected Output (Python-runnable)**

\# System prompts — set the assistant's role, rules, and persona for the whole chat  
def build\_messages(system, user):  
    return \[{"role": "system", "content": system}, {"role": "user", "content": user}\]  
   
def toy\_respond(messages):  
    system \= next(m\["content"\] for m in messages if m\["role"\] \== "system")  
    user \= next(m\["content"\] for m in messages if m\["role"\] \== "user")  
    \# The system prompt constrains behavior: persona \+ format rules  
    persona \= "Pirate" if "pirate" in system.lower() else "Assistant"  
    fmt \= "ONE sentence" if "one sentence" in system.lower() else "normal"  
    return f"\[{persona}, {fmt}\] answering: {user}"  
   
msgs \= build\_messages("You are a helpful pirate. Always answer in ONE sentence.", "What is Python?")  
print("Messages sent:", msgs)  
print("Response:", toy\_respond(msgs))  
assert toy\_respond(msgs).startswith("\[Pirate, ONE sentence\]")  
print("The system prompt is the first message; it shapes tone, role, constraints, and safety rules.")  
print("It applies to the whole conversation, unlike a single user turn.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Messages sent: \[{'role': 'system', 'content': 'You are a helpful pirate. Always answer in ONE sentence.'}, {'role': 'user', 'content': 'What is Python?'}\]  
\# Response: \[Pirate, ONE sentence\] answering: What is Python?  
\# The system prompt is the first message; it shapes tone, role, constraints, and safety rules.  
\# It applies to the whole conversation, unlike a single user turn.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: How is a system prompt different from a user prompt?**

A: The system prompt is a high-priority instruction that defines the assistant's behavior for the entire conversation; the user prompt is a single request from the human. The system prompt frames how all user prompts are answered.

**Q: What goes in a good system prompt?**

A: Role/persona, scope and domain, output format rules, tone, safety/guardrail constraints, and how to handle edge cases (e.g., when to decline or escalate).

**Q: Can users override the system prompt?**

A: Models generally treat system instructions as higher priority, but determined prompt-injection attempts can sometimes conflict with them — which is why guardrails and careful design matter for untrusted input.

## **9\. User prompts**

**Simple Explanation**

A user prompt is the actual request or message from the human — the question, instruction, or input you want the model to act on. In the chat format, it's sent as a message with role 'user', combined with the system prompt and any prior conversation history into the list the API receives.

The quality of a user prompt strongly affects the answer: specific, well-scoped prompts with relevant context and a clear desired output get far better results than vague ones. While the system prompt sets overall behavior, the user prompt carries the specific task for each turn.

**Hinglish Explanation**

User prompt human se aane wala actual request ya message hai — wo question, instruction, ya input jis par aap model ko act karwana chahte ho. Chat format mein, ye role 'user' ke saath ek message ke roop mein jaata hai, system prompt aur kisi bhi prior conversation history ke saath milkar us list mein jo API receive karta hai.

User prompt ki quality answer ko strongly affect karti hai: specific, well-scoped prompts jisme relevant context aur clear desired output ho, vague waalon se kahin behtar results dete hain. System prompt overall behavior set karta hai, jabki user prompt har turn ke liye specific task carry karta hai.

**Key Interview Points**

* The human's actual request, sent as a role:'user' message.

* Combined with system prompt \+ history into the API message list.

* Specific, well-scoped prompts with context get better answers.

* Carries the per-turn task; the system prompt sets overall behavior.

* Provide relevant details and the desired output format for best results.

**Real-World Example**

A developer's user prompt — 'This Python function throws IndexError on empty input; here's the code: \[...\]. Fix it and explain the change.' — gives the model exactly what it needs. A vague 'fix my code' (with no code or error) would get a far weaker response.

**Code — Full & Runnable (Python)**

*Real OpenAI message-assembly code (needs an API key). The Python-runnable demo below assembles system \+ history \+ user messages so the request structure is verifiable here.*

\# User prompts — the human's request, sent alongside system \+ prior history.  
from openai import OpenAI  
   
client \= OpenAI()  
   
def chat(system: str, history: list, user\_prompt: str) \-\> str:  
    messages \= \[{"role": "system", "content": system}\]  
    messages.extend(history)                                  \# previous turns (memory)  
    messages.append({"role": "user", "content": user\_prompt}) \# the new user prompt  
    response \= client.chat.completions.create(model="gpt-4o-mini", messages=messages)  
    return response.choices\[0\].message.content  
   
\# A good user prompt is specific and provides the context the model needs:  
\#   Weak:   "fix my code"  
\#   Strong: "This Python function throws IndexError on empty input. Here's the code: ...  
\#            Please fix it and explain the change."  
history \= \[  
    {"role": "user", "content": "What is a Python list?"},  
    {"role": "assistant", "content": "An ordered, mutable sequence."},  
\]  
\# chat("You are a concise tutor.", history, "How do I append to it?")

**Test / Demo & Expected Output (Python-runnable)**

\# User prompts — the actual request; combined with the system prompt into a message list  
def assemble(system, history, user):  
    messages \= \[{"role": "system", "content": system}\]  
    messages \+= history                       \# prior turns (memory)  
    messages.append({"role": "user", "content": user})   \# the new user prompt  
    return messages  
   
system \= "You are a concise coding tutor."  
history \= \[  
    {"role": "user", "content": "What is a list?"},  
    {"role": "assistant", "content": "An ordered, mutable collection."},  
\]  
user \= "How do I add to it?"  
msgs \= assemble(system, history, user)  
for m in msgs:  
    print(f"{m\['role'\]:9}: {m\['content'\]}")  
assert msgs\[0\]\["role"\] \== "system" and msgs\[-1\]\["content"\] \== user  
assert msgs\[-1\]\["role"\] \== "user"  
print("\\nThe user prompt is the human's input; the API receives system \+ history \+ the new user message.")  
print("Clear, specific user prompts (with context and desired format) get better answers.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# system   : You are a concise coding tutor.  
\# user     : What is a list?  
\# assistant: An ordered, mutable collection.  
\# user     : How do I add to it?  
\#   
\# The user prompt is the human's input; the API receives system \+ history \+ the new user message.  
\# Clear, specific user prompts (with context and desired format) get better answers.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What's the difference between user and system prompts?**

A: The user prompt is the specific request for the current turn; the system prompt is the overarching instruction that governs how the assistant behaves across the whole conversation.

**Q: How do you write a good user prompt?**

A: Be specific, include the necessary context and data, state the desired output format, and avoid ambiguity. Show, don't just tell — paste the code/error rather than describing it vaguely.

**Q: How do user prompts fit into the API call?**

A: They're appended (role 'user') to the messages array after the system prompt and any conversation history, forming the full context the model uses to generate its reply.

## **10\. Few-shot / zero-shot prompting**

**Simple Explanation**

Zero-shot prompting asks the model to perform a task using instructions alone, with no examples. Few-shot prompting includes a handful of input/output examples in the prompt to demonstrate exactly what you want — the format, the style, the decision boundary — before giving the real input.

Examples 'teach' the task in-context (no retraining), which improves accuracy and enforces consistent output format, especially for nuanced or format-sensitive tasks. The trade-off is that examples consume tokens. Zero-shot is simpler and cheaper; few-shot is more reliable when the task is tricky or the output must follow a precise pattern.

**Hinglish Explanation**

Zero-shot prompting model ko sirf instructions se task perform karne ko kehta hai, bina examples ke. Few-shot prompting prompt mein kuch input/output examples include karta hai taaki exactly dikhaye ki aap kya chahte ho — format, style, decision boundary — real input dene se pehle.

Examples task ko in-context 'sikhaate' hain (bina retraining), jo accuracy improve karta hai aur consistent output format enforce karta hai, khaaskar nuanced ya format-sensitive tasks ke liye. Trade-off ye hai ki examples tokens consume karte hain. Zero-shot simpler aur cheaper hai; few-shot zyada reliable hai jab task tricky ho ya output ek precise pattern follow kare.

**Key Interview Points**

* Zero-shot: instructions only, no examples.

* Few-shot: include a few input/output examples to demonstrate the task.

* Examples teach format/style/decision boundary in-context (no retraining).

* Few-shot improves accuracy and output consistency on tricky tasks.

* Trade-off: examples cost tokens; zero-shot is simpler and cheaper.

**Real-World Example**

To classify support tickets into exact categories, a team includes five labeled example tickets in the prompt (few-shot). The model then mirrors the pattern precisely — far more consistent than a zero-shot 'classify this ticket' that sometimes invents its own categories.

**Code — Full & Runnable (Python)**

*Real OpenAI zero-shot and few-shot code (needs an API key). The Python-runnable demo below shows few-shot examples improving classification accuracy, verifiable here.*

\# Few-shot vs zero-shot prompting — include examples to teach the task/format.  
from openai import OpenAI  
   
client \= OpenAI()  
   
\# ZERO-SHOT: instructions only.  
def zero\_shot(review: str) \-\> str:  
    return client.chat.completions.create(  
        model="gpt-4o-mini",  
        messages=\[{"role": "user", "content": f"Classify the sentiment (positive/negative): {review}"}\],  
    ).choices\[0\].message.content  
   
\# FEW-SHOT: demonstrate the exact input/output pattern with examples.  
def few\_shot(review: str) \-\> str:  
    messages \= \[  
        {"role": "system", "content": "Classify sentiment as exactly 'positive' or 'negative'."},  
        {"role": "user", "content": "Review: The food was amazing\!"},  
        {"role": "assistant", "content": "positive"},  
        {"role": "user", "content": "Review: Terrible service, never again."},  
        {"role": "assistant", "content": "negative"},  
        {"role": "user", "content": f"Review: {review}"},   \# the real query  
    \]  
    return client.chat.completions.create(model="gpt-4o-mini", messages=messages).choices\[0\].message.content  
   
\# Few-shot improves accuracy and enforces output format; zero-shot is simpler and  
\# uses fewer tokens. Use few-shot for tricky or format-sensitive tasks.

**Test / Demo & Expected Output (Python-runnable)**

\# Few-shot vs zero-shot — examples in the prompt steer the model's behavior  
\# Task: classify sentiment. Zero-shot uses rules only; few-shot learns the pattern from examples.  
def zero\_shot(text):  
    \# No examples: a naive keyword guess (often misses nuance)  
    return "positive" if "good" in text else "negative"  
   
def few\_shot(text, examples):  
    \# Examples teach the mapping; we mimic "pattern matching" to nearest example  
    def feats(t): return set(t.lower().split())  
    best\_label, best\_overlap \= "negative", \-1  
    for ex\_text, ex\_label in examples:  
        overlap \= len(feats(text) & feats(ex\_text))  
        if overlap \> best\_overlap:  
            best\_overlap, best\_label \= overlap, ex\_label  
    return best\_label  
   
examples \= \[("the movie was fantastic and fun", "positive"),  
            ("a boring and dull experience", "negative"),  
            ("absolutely loved every minute", "positive")\]  
test \= "what a fun and fantastic ride"  
print("Zero-shot:", zero\_shot(test), "(no 'good' keyword \-\> wrong)")  
print("Few-shot: ", few\_shot(test, examples), "(matched the positive examples)")  
assert zero\_shot(test) \== "negative"        \# naive rule fails  
assert few\_shot(test, examples) \== "positive"  \# examples fix it  
print("Zero-shot: instructions only. Few-shot: include input/output examples to demonstrate the task.")  
print("Few-shot improves accuracy on tricky/format-sensitive tasks at the cost of more tokens.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Zero-shot: negative (no 'good' keyword \-\> wrong)  
\# Few-shot:  positive (matched the positive examples)  
\# Zero-shot: instructions only. Few-shot: include input/output examples to demonstrate the task.  
\# Few-shot improves accuracy on tricky/format-sensitive tasks at the cost of more tokens.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: When should you use few-shot over zero-shot?**

A: When the task is nuanced, the output must follow a specific format, or zero-shot results are inconsistent. Examples demonstrate exactly what you want and improve reliability — at the cost of extra tokens.

**Q: Does few-shot retrain the model?**

A: No. It's in-context learning — the examples only guide the model within that single prompt. The weights don't change; it's not fine-tuning.

**Q: How many examples should few-shot use?**

A: Usually a small handful (often 2–5) chosen to be representative and diverse. More can help but cost tokens and eventually hit diminishing returns or context limits.

## **11\. Chain-of-thought prompting**

**Simple Explanation**

Chain-of-thought (CoT) prompting asks the model to reason step by step before giving a final answer (e.g., 'Let's think step by step'). By generating intermediate reasoning, the model handles multi-step math, logic, and complex problems far more accurately than when it jumps straight to an answer.

CoT works because each reasoning step conditions the next, letting the model break a hard problem into manageable parts. The trade-off is more tokens and latency. In production you can let the model reason and then extract just the final answer, or use it selectively for problems that genuinely need multi-step reasoning.

**Hinglish Explanation**

Chain-of-thought (CoT) prompting model ko final answer dene se pehle step by step reason karne ko kehta hai (jaise 'Let's think step by step'). Intermediate reasoning generate karke, model multi-step math, logic aur complex problems ko seedhe answer par jump karne se kahin zyada accurately handle karta hai.

CoT isliye kaam karta hai kyunki har reasoning step agle ko condition karta hai, jisse model ek hard problem ko manageable parts mein todh sake. Trade-off zyada tokens aur latency hai. Production mein aap model ko reason karne de sakte ho aur phir sirf final answer extract kar sakte ho, ya use selectively un problems ke liye use kar sakte ho jinhe sach mein multi-step reasoning chahiye.

**Key Interview Points**

* Prompt the model to reason step by step before answering.

* Greatly improves accuracy on math, logic, and multi-step problems.

* Each intermediate step conditions the next, decomposing hard problems.

* Trade-off: more tokens and latency.

* In production, reason then extract the final answer, or use selectively.

**Real-World Example**

For a multi-step word problem, prompting 'think step by step' makes the model show each calculation — start, add, subtract — and arrive at the correct total, whereas a direct ask often skips a step and gives a wrong number.

**Code — Full & Runnable (Python)**

*Real OpenAI chain-of-thought prompting code (needs an API key). The Python-runnable demo below shows step-by-step reasoning fixing a multi-step error, verifiable here.*

\# Chain-of-thought prompting — ask the model to reason step by step.  
from openai import OpenAI  
   
client \= OpenAI()  
   
def solve\_with\_cot(problem: str) \-\> str:  
    \# Encouraging explicit reasoning improves multi-step math/logic accuracy.  
    prompt \= f"{problem}\\n\\nLet's think step by step, then give the final answer."  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        temperature=0,  
        messages=\[{"role": "user", "content": prompt}\],  
    )  
    return response.choices\[0\].message.content  
   
\# For production where you only want the final answer, you can ask the model to  
\# reason internally and return just the result, or parse the last line.  
\# Chain-of-thought trades extra tokens for better reasoning on complex problems.

**Test / Demo & Expected Output (Python-runnable)**

\# Chain-of-thought — reasoning step by step beats jumping to an answer  
problem \= {"start": 23, "buy": 7, "give\_per\_friend": 3, "friends": 5}  
   
def no\_cot(p):  
    \# "Guess" the final number without showing work (error-prone for multi-step)  
    return p\["start"\] \+ p\["buy"\]   \# forgets to subtract what was given away  
   
def with\_cot(p):  
    steps \= \[\]  
    total \= p\["start"\]; steps.append(f"Start with {total} apples")  
    total \+= p\["buy"\]; steps.append(f"Buy {p\['buy'\]} \-\> {total}")  
    given \= p\["give\_per\_friend"\] \* p\["friends"\]  
    total \-= given; steps.append(f"Give {p\['give\_per\_friend'\]} to each of {p\['friends'\]} friends \= {given} \-\> {total}")  
    return total, steps  
   
answer, steps \= with\_cot(problem)  
print("Without chain-of-thought:", no\_cot(problem), "(wrong)")  
print("With chain-of-thought:")  
for s in steps: print("  \-", s)  
print("Final answer:", answer)  
assert no\_cot(problem) \== 30 and answer \== 15  
print("Chain-of-thought \= prompting the model to reason step by step ('think step by step').")  
print("It improves accuracy on math, logic, and multi-step problems.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Without chain-of-thought: 30 (wrong)  
\# With chain-of-thought:  
\#   \- Start with 23 apples  
\#   \- Buy 7 \-\> 30  
\#   \- Give 3 to each of 5 friends \= 15 \-\> 15  
\# Final answer: 15  
\# Chain-of-thought \= prompting the model to reason step by step ('think step by step').  
\# It improves accuracy on math, logic, and multi-step problems.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why does chain-of-thought improve accuracy?**

A: Generating intermediate steps lets the model decompose a complex problem and condition each step on the previous reasoning, reducing the errors that come from leaping straight to an answer.

**Q: What's the downside of chain-of-thought?**

A: It uses more tokens and adds latency, and the verbose reasoning may not be wanted in the final output — so you often extract just the conclusion or reserve CoT for genuinely hard tasks.

**Q: How is CoT related to the ReAct pattern?**

A: ReAct extends chain-of-thought by interleaving reasoning with actions (tool calls) and observations, so the model can ground its step-by-step thinking in real external results.

## **12\. ReAct pattern**

**Simple Explanation**

ReAct (Reason \+ Act) is a pattern where the LLM interleaves reasoning with actions: it produces a Thought, takes an Action (calling a tool like search or a calculator), receives an Observation (the tool's result), and repeats until it can give a final Answer. This grounds its reasoning in real, external information.

ReAct is the foundation of tool-using agents: instead of relying only on what's in its weights, the model can look things up, do calculations, or call APIs, then incorporate the results. It combines chain-of-thought reasoning with the ability to act, making LLMs far more capable on tasks that require fresh data or precise computation.

**Hinglish Explanation**

ReAct (Reason \+ Act) ek pattern hai jahan LLM reasoning ko actions ke saath interleave karta hai: ye ek Thought produce karta hai, ek Action leta hai (search ya calculator jaisa tool call karke), ek Observation receive karta hai (tool ka result), aur repeat karta hai jab tak final Answer na de sake. Ye uski reasoning ko real, external information mein ground karta hai.

ReAct tool-using agents ka aadhaar hai: sirf apne weights mein jo hai uspar depend karne ke bajaye, model cheezein look up kar sakta hai, calculations kar sakta hai, ya APIs call kar sakta hai, phir results incorporate kar sakta hai. Ye chain-of-thought reasoning ko act karne ki ability ke saath combine karta hai, LLMs ko un tasks par zyada capable banakar jinhe fresh data ya precise computation chahiye.

**Key Interview Points**

* Reason \+ Act: interleaves Thought \-\> Action (tool) \-\> Observation, looping to an Answer.

* Grounds reasoning in real external results (search, calculators, APIs).

* Overcomes the limits of relying only on the model's weights.

* The foundation of tool-using AI agents.

* Combines chain-of-thought with the ability to take actions.

**Real-World Example**

Asked 'what's double the population of France?', a ReAct agent reasons it needs the population, calls a search tool (observes \~68 million), then calls a calculator tool (observes 136 million), and answers — grounding each step in tool results instead of guessing.

**Code — Full & Runnable (Python)**

*Real LangChain ReAct-agent code (needs an API key). The Python-runnable demo below simulates the Thought → Action → Observation loop so the pattern is verifiable here.*

\# ReAct pattern — reason \+ act with tools, looping until an answer (LangChain).  
from langchain\_openai import ChatOpenAI  
from langchain.agents import create\_react\_agent, AgentExecutor  
from langchain\_core.tools import tool  
from langchain import hub  
   
@tool  
def calculator(expression: str) \-\> str:  
    """Evaluate a basic arithmetic expression."""  
    return str(eval(expression, {"\_\_builtins\_\_": {}}))  
   
@tool  
def search(query: str) \-\> str:  
    """Look up a fact from the web (stub)."""  
    return "France population: \~68 million"  
   
llm \= ChatOpenAI(model="gpt-4o-mini", temperature=0)  
prompt \= hub.pull("hwchase17/react")          \# the ReAct prompt template  
agent \= create\_react\_agent(llm, \[calculator, search\], prompt)  
executor \= AgentExecutor(agent=agent, tools=\[calculator, search\], verbose=True)  
   
\# The agent emits Thought \-\> Action \-\> Observation steps, using tools until it can  
\# answer. ReAct grounds the LLM's reasoning in real tool results.  
\# executor.invoke({"input": "What is double the population of France?"})

**Test / Demo & Expected Output (Python-runnable)**

\# ReAct pattern — interleave Reasoning (Thought) with Acting (tool use) and Observation  
def calculator(expr): return eval(expr, {"\_\_builtins\_\_": {}})  
def search(q): return {"population of france": "68 million"}.get(q.lower(), "no result")  
tools \= {"calculator": calculator, "search": search}  
   
def react\_agent(question):  
    trace \= \[\]  
    \# The agent reasons, picks a tool, acts, observes, then answers.  
    if "population" in question and "double" in question:  
        trace.append(("Thought", "I need France's population, then double it."))  
        trace.append(("Action", "search\[population of france\]"))  
        obs \= search("population of france"); trace.append(("Observation", obs))  
        trace.append(("Thought", "Population is 68 million; double it with the calculator."))  
        trace.append(("Action", "calculator\[68 \* 2\]"))  
        obs2 \= calculator("68 \* 2"); trace.append(("Observation", f"{obs2} million"))  
        trace.append(("Answer", f"{obs2} million"))  
    return trace  
   
for step, val in react\_agent("What is double the population of France?"):  
    print(f"{step:12}: {val}")  
trace \= react\_agent("What is double the population of France?")  
assert trace\[-1\] \== ("Answer", "136 million")  
print("\\nReAct \= Reason \+ Act: Thought \-\> Action (tool) \-\> Observation, looped until an Answer.")  
print("It lets LLMs use tools (search, calculators, APIs) and ground their reasoning in real results.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Thought     : I need France's population, then double it.  
\# Action      : search\[population of france\]  
\# Observation : 68 million  
\# Thought     : Population is 68 million; double it with the calculator.  
\# Action      : calculator\[68 \* 2\]  
\# Observation : 136 million  
\# Answer      : 136 million  
\#   
\# ReAct \= Reason \+ Act: Thought \-\> Action (tool) \-\> Observation, looped until an Answer.  
\# It lets LLMs use tools (search, calculators, APIs) and ground their reasoning in real results.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What does ReAct stand for and do?**

A: Reason \+ Act. The model alternates between reasoning (Thought) and acting (calling tools), using each tool's Observation to inform the next step until it can produce a final answer.

**Q: Why is ReAct powerful for agents?**

A: It lets the LLM use external tools — search, calculators, APIs, databases — to get fresh, accurate information and perform actions, rather than being limited to its frozen training knowledge.

**Q: How does ReAct relate to chain-of-thought?**

A: ReAct builds on chain-of-thought by adding actions and observations to the reasoning loop, grounding the step-by-step thinking in real-world tool results instead of pure internal reasoning.

## **13\. temperature**

**Simple Explanation**

Temperature is a sampling parameter that controls the randomness of an LLM's output. Technically, it rescales the next-token probability distribution before sampling: a low temperature sharpens it (the model almost always picks the most likely token — focused, deterministic), while a high temperature flattens it (more varied, creative, sometimes erratic).

Use low temperature (around 0–0.3) for tasks needing accuracy and consistency — factual Q\&A, code, data extraction — where you want repeatable results. Use higher temperature (around 0.7–1.0) for creative tasks like brainstorming or story writing where variety is desirable. At temperature 0, output is effectively greedy and near-deterministic.

**Hinglish Explanation**

Temperature ek sampling parameter hai jo LLM ke output ki randomness control karta hai. Technically, ye next-token probability distribution ko sampling se pehle rescale karta hai: low temperature use sharpen karta hai (model lagbhag hamesha sabse likely token chunta hai — focused, deterministic), jabki high temperature use flatten karta hai (zyada varied, creative, kabhi erratic).

Low temperature (lagbhag 0–0.3) accuracy aur consistency waale tasks ke liye use karo — factual Q\&A, code, data extraction — jahan repeatable results chahiye. Higher temperature (lagbhag 0.7–1.0) creative tasks jaise brainstorming ya story writing ke liye jahan variety achhi hai. Temperature 0 par output effectively greedy aur near-deterministic hota hai.

**Key Interview Points**

* Controls randomness by rescaling the next-token probability distribution.

* Low temp \-\> peaked/deterministic (picks the likeliest token).

* High temp \-\> flatter/varied (more creative, sometimes erratic).

* Low (0–0.3): facts, code, extraction. Higher (0.7–1.0): creative work.

* Temperature 0 is effectively greedy/near-deterministic.

**Real-World Example**

A code-generation feature uses temperature 0 so it returns the same correct solution every time, while the app's 'creative tagline generator' uses temperature 0.9 to produce a fresh, varied set of ideas on each click.

**Code — Full & Runnable (Python)**

*Real OpenAI temperature code (needs an API key). The Python-runnable demo below computes the temperature-scaled softmax so the effect on the distribution is verifiable here.*

\# temperature — control randomness/creativity of generation.  
from openai import OpenAI  
   
client \= OpenAI()  
   
def generate(prompt: str, temperature: float) \-\> str:  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        temperature=temperature,   \# 0 \= deterministic/focused, \~1+ \= creative/varied  
        messages=\[{"role": "user", "content": prompt}\],  
    )  
    return response.choices\[0\].message.content  
   
\# Low temperature (0-0.3): factual Q\&A, code, extraction — repeatable and safe.  
\# Higher temperature (0.7-1.0): brainstorming, story writing, varied ideas.  
\# Temperature rescales the next-token probability distribution before sampling.  
\# factual \= generate("List the planets in order.", 0\)  
\# creative \= generate("Invent a name for a coffee shop.", 0.9)

**Test / Demo & Expected Output (Python-runnable)**

\# temperature — scales the softmax: low \= focused/deterministic, high \= diverse/random  
import math  
logits \= {"cat": 2.0, "dog": 1.0, "bird": 0.5, "fish": 0.2}  
   
def softmax\_with\_temp(logits, T):  
    scaled \= {k: v / T for k, v in logits.items()}  
    m \= max(scaled.values())  
    exps \= {k: math.exp(v \- m) for k, v in scaled.items()}  
    z \= sum(exps.values())  
    return {k: v / z for k, v in exps.items()}  
   
for T in (0.2, 1.0, 2.0):  
    p \= softmax\_with\_temp(logits, T)  
    top \= max(p, key=p.get)  
    print(f"T={T}: " \+ ", ".join(f"{k}={v:.2f}" for k, v in p.items()) \+ f"  (top={top} {p\[top\]:.2f})")  
   
low \= softmax\_with\_temp(logits, 0.2)  
high \= softmax\_with\_temp(logits, 2.0)  
\# Lower temperature concentrates probability on the top token:  
assert low\["cat"\] \> high\["cat"\], "low temperature is more peaked/deterministic"  
print("\\nLow temperature \-\> safe, repeatable output. High temperature \-\> creative, varied output.")  
print("Use low temp for facts/code, higher temp for brainstorming/creative writing.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# T=0.2: cat=0.99, dog=0.01, bird=0.00, fish=0.00  (top=cat 0.99)  
\# T=1.0: cat=0.57, dog=0.21, bird=0.13, fish=0.09  (top=cat 0.57)  
\# T=2.0: cat=0.40, dog=0.24, bird=0.19, fish=0.16  (top=cat 0.40)  
\#   
\# Low temperature \-\> safe, repeatable output. High temperature \-\> creative, varied output.  
\# Use low temp for facts/code, higher temp for brainstorming/creative writing.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What does temperature actually change?**

A: It scales the logits before the softmax, changing how peaked or flat the next-token probability distribution is. Lower temperature concentrates probability on the top tokens; higher spreads it out.

**Q: When would you use temperature 0?**

A: For deterministic, repeatable outputs — factual answers, code, data extraction, classification — where you want the most likely (and consistent) result every time.

**Q: Should you tune temperature and top\_p together?**

A: Usually adjust one, not both. They both affect randomness via the distribution, and tuning both at once makes behavior harder to reason about.

## **14\. top\_p**

**Simple Explanation**

Top-p (nucleus sampling) limits sampling to the smallest set of most-likely tokens whose cumulative probability reaches p. For example, top\_p=0.9 keeps just enough top tokens to cover 90% of the probability mass and samples from those, discarding the unlikely tail.

Unlike top\_k (a fixed count), top\_p adapts: when the model is confident, the nucleus is small; when it's uncertain, more tokens qualify. Lower p makes output more focused and safe; higher p allows more diversity. It's an alternative to (or used alongside) temperature — the common advice is to tune one, not both.

**Hinglish Explanation**

Top-p (nucleus sampling) sampling ko sabse likely tokens ke smallest set tak limit karta hai jinka cumulative probability p tak pahunche. Jaise top\_p=0.9 sirf utne top tokens rakhta hai jo 90% probability mass cover karein aur unmein se sample karta hai, unlikely tail discard karke.

Top\_k (fixed count) ke ulta, top\_p adapt karta hai: jab model confident ho, nucleus chhota hota hai; jab uncertain ho, zyada tokens qualify karte hain. Lower p output ko zyada focused aur safe banata hai; higher p zyada diversity deta hai. Ye temperature ka alternative hai (ya saath use hota hai) — common advice hai ek tune karo, dono nahi.

**Key Interview Points**

* Samples from the smallest set of tokens covering cumulative probability p.

* top\_p=0.9 \-\> keeps the top tokens summing to 90% of the mass.

* Dynamic count: small nucleus when confident, larger when uncertain.

* Lower p \-\> focused; higher p \-\> diverse.

* Alternative to temperature — tune one, not both.

**Real-World Example**

A summarization endpoint sets top\_p=0.1 so the model only picks among its very top choices — producing tight, predictable summaries — while a creative-writing endpoint uses top\_p=0.95 to allow a wider, more varied vocabulary.

**Code — Full & Runnable (Python)**

*Real OpenAI top\_p code (needs an API key). The Python-runnable demo below implements nucleus sampling so the dynamic token selection is verifiable here.*

\# top\_p (nucleus sampling) — sample from the smallest set covering probability p.  
from openai import OpenAI  
   
client \= OpenAI()  
   
def generate(prompt: str, top\_p: float) \-\> str:  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        top\_p=top\_p,   \# consider only tokens within the top cumulative probability p  
        messages=\[{"role": "user", "content": prompt}\],  
    )  
    return response.choices\[0\].message.content  
   
\# top\_p=0.1 \-\> very focused (only the most likely tokens);  
\# top\_p=1.0 \-\> consider the full distribution.  
\# It selects a DYNAMIC number of tokens (the "nucleus"), unlike top\_k's fixed count.  
\# Tip: tune EITHER temperature OR top\_p, not both at once.  
\# focused \= generate("Define recursion.", top\_p=0.1)

**Test / Demo & Expected Output (Python-runnable)**

\# top\_p (nucleus sampling) — keep the smallest set of tokens whose probs sum to \>= p  
probs \= {"cat": 0.40, "dog": 0.30, "bird": 0.15, "fish": 0.10, "ant": 0.05}  
   
def nucleus(probs, p):  
    ordered \= sorted(probs.items(), key=lambda kv: kv\[1\], reverse=True)  
    kept, cumulative \= \[\], 0.0  
    for token, pr in ordered:  
        kept.append((token, pr)); cumulative \+= pr  
        if cumulative \>= p: break          \# stop once we cover p of the mass  
    total \= sum(pr for \_, pr in kept)  
    return {t: pr / total for t, pr in kept}  \# renormalize over the nucleus  
   
for p in (0.5, 0.9):  
    nuc \= nucleus(probs, p)  
    print(f"top\_p={p}: kept {list(nuc)} \-\> " \+ ", ".join(f"{k}={v:.2f}" for k, v in nuc.items()))  
   
n5 \= nucleus(probs, 0.5)  
assert set(n5) \== {"cat", "dog"}, "top\_p=0.5 keeps only the top tokens covering 50%"  
print("\\nTop-p picks a dynamic number of tokens (the 'nucleus') covering probability mass p.")  
print("Lower p \-\> more focused; higher p \-\> more diverse. Often used instead of/with temperature.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# top\_p=0.5: kept \['cat', 'dog'\] \-\> cat=0.57, dog=0.43  
\# top\_p=0.9: kept \['cat', 'dog', 'bird', 'fish'\] \-\> cat=0.42, dog=0.32, bird=0.16, fish=0.11  
\#   
\# Top-p picks a dynamic number of tokens (the 'nucleus') covering probability mass p.  
\# Lower p \-\> more focused; higher p \-\> more diverse. Often used instead of/with temperature.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: How does top\_p differ from top\_k?**

A: Top\_p keeps a dynamic number of tokens covering probability mass p, adapting to the model's confidence. Top\_k keeps a fixed number (k) of top tokens regardless of their probabilities.

**Q: What is the 'nucleus' in nucleus sampling?**

A: The smallest group of highest-probability tokens whose probabilities sum to at least p. The model samples only from this nucleus, discarding the long, unlikely tail.

**Q: Should you combine top\_p with temperature?**

A: Generally tune one at a time. Both control randomness through the distribution, so adjusting both together makes the output behavior harder to predict and reason about.

## **15\. top\_k**

**Simple Explanation**

Top-k sampling restricts the model to choosing from only the k highest-probability next tokens, ignoring everything else, then renormalizes and samples among them. With top\_k=1 the model is greedy — it always takes the single most likely token (deterministic); larger k allows more variety.

Top-k is a fixed-count cutoff, in contrast to top\_p's dynamic, probability-based cutoff. It's exposed by many runtimes (Hugging Face, Ollama, Google/Anthropic SDKs); the OpenAI Chat API instead exposes temperature and top\_p. All three are ways to control the randomness/diversity of generation.

**Hinglish Explanation**

Top-k sampling model ko sirf k highest-probability next tokens mein se choose karne tak restrict karta hai, baaki sab ignore karke, phir renormalize karke unmein se sample karta hai. top\_k=1 par model greedy hota hai — hamesha single sabse likely token leta hai (deterministic); bada k zyada variety deta hai.

Top-k ek fixed-count cutoff hai, top\_p ke dynamic, probability-based cutoff ke ulta. Ye kai runtimes expose karte hain (Hugging Face, Ollama, Google/Anthropic SDKs); OpenAI Chat API iske bajaye temperature aur top\_p expose karta hai. Teeno generation ki randomness/diversity control karne ke tarike hain.

**Key Interview Points**

* Restricts sampling to the k most-likely tokens, then renormalizes.

* top\_k=1 is greedy/deterministic; larger k adds variety.

* A fixed-count cutoff (vs top\_p's dynamic, probability-based cutoff).

* Exposed by many runtimes (Hugging Face, Ollama, etc.).

* One of three randomness controls alongside temperature and top\_p.

**Real-World Example**

Running a local Llama model with Ollama, a developer sets top\_k=1 for a deterministic extraction task (always the top token) and raises it to 40 for a chatbot so replies feel natural and varied rather than robotic.

**Code — Full & Runnable (Python)**

*Real Ollama top\_k code (the OpenAI Chat API exposes temperature/top\_p; top\_k is common in other runtimes). The Python-runnable demo below implements top-k filtering so the selection is verifiable here.*

\# top\_k — restrict sampling to the k most likely tokens.  
\# Note: the OpenAI Chat API exposes temperature/top\_p; top\_k is common in other  
\# runtimes (Hugging Face, Ollama, Google/Anthropic SDKs). Example with Ollama:  
import ollama  
   
def generate(prompt: str, top\_k: int) \-\> str:  
    response \= ollama.chat(  
        model="llama3",  
        messages=\[{"role": "user", "content": prompt}\],  
        options={"top\_k": top\_k},   \# only the k highest-probability tokens are eligible  
    )  
    return response\["message"\]\["content"\]  
   
\# top\_k=1 \-\> greedy/deterministic (always the single most likely token).  
\# Larger k \-\> more diversity. top\_k is a FIXED count; top\_p is a dynamic cutoff.  
\# focused \= generate("Name a color.", top\_k=1)

**Test / Demo & Expected Output (Python-runnable)**

\# top\_k — keep only the k highest-probability tokens, then renormalize and sample from them  
probs \= {"cat": 0.40, "dog": 0.30, "bird": 0.15, "fish": 0.10, "ant": 0.05}  
   
def top\_k(probs, k):  
    ordered \= sorted(probs.items(), key=lambda kv: kv\[1\], reverse=True)\[:k\]  
    total \= sum(pr for \_, pr in ordered)  
    return {t: pr / total for t, pr in ordered}  
   
for k in (1, 3):  
    tk \= top\_k(probs, k)  
    print(f"top\_k={k}: " \+ ", ".join(f"{t}={p:.2f}" for t, p in tk.items()))  
   
t1 \= top\_k(probs, 1\)  
t3 \= top\_k(probs, 3\)  
assert list(t1) \== \["cat"\] and t1\["cat"\] \== 1.0, "top\_k=1 is greedy (argmax)"  
assert len(t3) \== 3, "top\_k=3 keeps three tokens"  
print("\\nTop-k restricts sampling to the k most likely tokens (a fixed count).")  
print("top\_k=1 is greedy/deterministic; larger k allows more variety. Contrast: top\_p is a dynamic count.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# top\_k=1: cat=1.00  
\# top\_k=3: cat=0.47, dog=0.35, bird=0.18  
\#   
\# Top-k restricts sampling to the k most likely tokens (a fixed count).  
\# top\_k=1 is greedy/deterministic; larger k allows more variety. Contrast: top\_p is a dynamic count.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What does top\_k=1 do?**

A: It makes generation greedy — the model always picks the single highest-probability token, producing deterministic output (the same input gives the same result).

**Q: Top\_k vs top\_p — the key difference?**

A: Top\_k keeps a fixed number of top tokens; top\_p keeps a variable number that together cover probability mass p. Top\_p adapts to the model's confidence; top\_k does not.

**Q: Why doesn't the OpenAI Chat API expose top\_k?**

A: It exposes temperature and top\_p as its randomness controls. Top\_k is common in other runtimes (Hugging Face, Ollama, some other vendor SDKs), but the concept — limiting candidate tokens — is the same idea.

## **16\. max\_tokens**

**Simple Explanation**

max\_tokens caps how many tokens the model is allowed to generate in its response. It limits the output length only — not the input — though input plus output together must still fit within the model's context window. It's a key control for cost, latency, and preventing runaway responses.

If the model reaches the cap before finishing naturally, the response is truncated and the API reports finish\_reason='length' (versus 'stop' for a natural ending). Set max\_tokens high enough to avoid cutting off useful answers, but low enough to control cost and keep responses tight.

**Hinglish Explanation**

max\_tokens cap karta hai ki model apne response mein kitne tokens generate kar sakta hai. Ye sirf output length limit karta hai — input nahi — halaanki input plus output saath mein abhi bhi model ke context window mein fit hone chahiye. Ye cost, latency, aur runaway responses rokne ka ek key control hai.

Agar model naturally finish hone se pehle cap tak pahunch jaye, response truncate ho jaata hai aur API finish\_reason='length' report karta hai (natural ending ke liye 'stop' ke ulta). max\_tokens itna high set karo ki useful answers cut na hon, par itna low ki cost control rahe aur responses tight rahein.

**Key Interview Points**

* Caps the number of OUTPUT tokens the model may generate.

* Limits output length only; input \+ output must fit the context window.

* Controls cost, latency, and prevents runaway responses.

* finish\_reason='length' means it was truncated; 'stop' \= natural ending.

* Set high enough to avoid cut-offs, low enough to control cost.

**Real-World Example**

A tweet-generator sets max\_tokens to a small value so replies stay short and cheap. A long-form report endpoint sets it much higher — and watches for finish\_reason='length' to detect and handle answers that were cut off mid-sentence.

**Code — Full & Runnable (Python)**

*Real OpenAI max\_tokens code (needs an API key). The Python-runnable demo below simulates generation hitting the cap so the finish\_reason behavior is verifiable here.*

\# max\_tokens — cap the length of the generated output.  
from openai import OpenAI  
   
client \= OpenAI()  
   
def summarize(text: str, max\_tokens: int) \-\> dict:  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        max\_tokens=max\_tokens,   \# hard cap on OUTPUT tokens (not input)  
        messages=\[{"role": "user", "content": f"Summarize:\\n{text}"}\],  
    )  
    choice \= response.choices\[0\]  
    return {  
        "text": choice.message.content,  
        "finish\_reason": choice.finish\_reason,  \# 'stop' \= natural end, 'length' \= hit the cap  
        "completion\_tokens": response.usage.completion\_tokens,  
    }  
   
\# Input \+ output must both fit in the model's context window. Set max\_tokens to  
\# control cost and latency, but leave enough room to avoid truncated answers  
\# (finish\_reason \== 'length' signals truncation).

**Test / Demo & Expected Output (Python-runnable)**

\# max\_tokens — caps how many tokens the model may GENERATE (not the input length)  
def generate(prompt\_tokens, max\_tokens):  
    \# Toy generator: emits tokens until it hits a natural stop or the max\_tokens cap.  
    full\_response \= \["The", "answer", "is", "that", "Python", "is", "great", ".", "\<eos\>"\]  
    out, finish\_reason \= \[\], "stop"  
    for i, tok in enumerate(full\_response):  
        if len(out) \>= max\_tokens:  
            finish\_reason \= "length"; break        \# truncated by the cap  
        if tok \== "\<eos\>":  
            break                                   \# natural stop  
        out.append(tok)  
    return {"text": " ".join(out), "tokens\_used": len(out), "finish\_reason": finish\_reason}  
   
short \= generate(prompt\_tokens=10, max\_tokens=3)  
full \= generate(prompt\_tokens=10, max\_tokens=50)  
print("max\_tokens=3 \-\>", short)  
print("max\_tokens=50 \-\>", full)  
assert short\["finish\_reason"\] \== "length" and short\["tokens\_used"\] \== 3  
assert full\["finish\_reason"\] \== "stop"  
print("\\nmax\_tokens limits the OUTPUT length; input \+ output must both fit in the context window.")  
print("finish\_reason='length' means the cap cut it off; 'stop' means it ended naturally.")  
print("Set it to control cost and avoid truncated answers.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# max\_tokens=3 \-\> {'text': 'The answer is', 'tokens\_used': 3, 'finish\_reason': 'length'}  
\# max\_tokens=50 \-\> {'text': 'The answer is that Python is great .', 'tokens\_used': 8, 'finish\_reason': 'stop'}  
\#   
\# max\_tokens limits the OUTPUT length; input \+ output must both fit in the context window.  
\# finish\_reason='length' means the cap cut it off; 'stop' means it ended naturally.  
\# Set it to control cost and avoid truncated answers.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Does max\_tokens limit the input too?**

A: No — it only caps the generated output. The input length is separate, but input and output combined must fit within the model's total context window.

**Q: How do you know if a response was truncated?**

A: Check finish\_reason: 'length' means the output hit the max\_tokens cap and was cut off; 'stop' means the model ended naturally (or hit a stop sequence).

**Q: Why set max\_tokens at all?**

A: To control cost and latency and to prevent overly long or runaway outputs. Right-sizing it keeps responses tight while leaving enough room to finish the answer.

## **17\. frequency penalty**

**Simple Explanation**

The frequency penalty reduces the likelihood of a token in proportion to how many times it has already appeared in the generated text. The more often a token has been used, the more its score is lowered — discouraging the model from repeating the same words or phrases and getting stuck in loops.

It ranges roughly from \-2.0 to 2.0 (positive values discourage repetition). It's especially useful for longer generations that tend to repeat. It differs from the presence penalty, which applies a one-time penalty for any token that has appeared at all, regardless of count.

**Hinglish Explanation**

Frequency penalty ek token ki likelihood ko is proportion mein kam karti hai ki wo generated text mein kitni baar aa chuka hai. Token jitni baar use hua ho, uska score utna zyada kam hota hai — model ko same words ya phrases repeat karne aur loops mein phasne se discourage karke.

Ye lagbhag \-2.0 se 2.0 tak hoti hai (positive values repetition discourage karti hain). Ye khaaskar lambi generations ke liye useful hai jo repeat karne lagti hain. Ye presence penalty se alag hai, jo kisi bhi token jo bilkul bhi aaya ho uspar ek one-time penalty lagati hai, count chahe jo ho.

**Key Interview Points**

* Lowers a token's probability based on how MANY times it has appeared.

* Discourages repetition and getting stuck in loops.

* Range roughly \-2.0 to 2.0 (positive discourages repetition).

* Useful for longer generations prone to repeating.

* Differs from presence penalty (count-based vs one-time).

**Real-World Example**

A long product-description generator kept repeating 'high-quality' over and over. Raising the frequency penalty made the model vary its wording — 'premium', 'well-made', 'durable' — producing more natural, less repetitive copy.

**Code — Full & Runnable (Python)**

*Real OpenAI frequency\_penalty code (needs an API key). The Python-runnable demo below applies a count-based logit penalty so the anti-repetition effect is verifiable here.*

\# frequency\_penalty — discourage repeating the same tokens (scaled by count).  
from openai import OpenAI  
   
client \= OpenAI()  
   
def generate(prompt: str, frequency\_penalty: float) \-\> str:  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        frequency\_penalty=frequency\_penalty,  \# range \-2.0..2.0; higher \-\> less repetition  
        messages=\[{"role": "user", "content": prompt}\],  
    )  
    return response.choices\[0\].message.content  
   
\# frequency\_penalty lowers a token's probability in proportion to how MANY times it  
\# has already appeared, reducing repetitive loops and verbatim repetition.  
\# Useful for long generations that tend to repeat phrases.  
\# varied \= generate("List 20 creative startup names.", frequency\_penalty=0.8)

**Test / Demo & Expected Output (Python-runnable)**

\# frequency penalty — lower the score of tokens proportional to how often they appeared  
import math  
from collections import Counter  
base\_logits \= {"the": 2.0, "cat": 1.5, "dog": 1.4, "ran": 1.0}  
   
def apply\_frequency\_penalty(logits, counts, penalty):  
    \# new\_logit \= logit \- penalty \* count(token\_so\_far)  
    return {t: l \- penalty \* counts.get(t, 0\) for t, l in logits.items()}  
   
generated \= \["the", "the", "the"\]      \# "the" has been used a lot already  
counts \= Counter(generated)  
adjusted \= apply\_frequency\_penalty(base\_logits, counts, penalty=0.8)  
print("Counts so far:", dict(counts))  
print("Base logits:    ", {k: round(v, 2\) for k, v in base\_logits.items()})  
print("After penalty:  ", {k: round(v, 2\) for k, v in adjusted.items()})  
print("New top token:", max(adjusted, key=adjusted.get), "(was 'the')")  
assert adjusted\["the"\] \< base\_logits\["the"\], "frequent token is penalized"  
assert max(adjusted, key=adjusted.get) \!= "the", "penalty discourages repetition"  
print("\\nFrequency penalty scales with how MANY times a token appeared \-\> reduces repetitive loops.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Counts so far: {'the': 3}  
\# Base logits:     {'the': 2.0, 'cat': 1.5, 'dog': 1.4, 'ran': 1.0}  
\# After penalty:   {'the': \-0.4, 'cat': 1.5, 'dog': 1.4, 'ran': 1.0}  
\# New top token: cat (was 'the')  
\#   
\# Frequency penalty scales with how MANY times a token appeared \-\> reduces repetitive loops.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What does frequency penalty do?**

A: It reduces the probability of tokens proportionally to how often they've already been generated, discouraging repetition and repetitive loops in the output.

**Q: Frequency penalty vs presence penalty?**

A: Frequency penalty scales with the number of occurrences (more uses \= bigger penalty). Presence penalty is a flat, one-time penalty for any token that has appeared at all, pushing toward new topics.

**Q: When would you increase it?**

A: For long generations that repeat words or phrases, or when you want more lexical variety. Too high, though, can make the text avoid necessary words and read unnaturally.

## **18\. presence penalty**

**Simple Explanation**

The presence penalty lowers the probability of any token that has already appeared in the output — but as a flat, one-time penalty regardless of how many times it occurred. Its effect is to nudge the model toward introducing new words and topics rather than dwelling on ones already mentioned.

Like the frequency penalty, it ranges roughly from \-2.0 to 2.0 (positive encourages novelty). The distinction: frequency penalty grows with repetition count, while presence penalty is binary (appeared or not). Use presence penalty when you want the model to explore broader topics or generate more diverse ideas.

**Hinglish Explanation**

Presence penalty kisi bhi token ki probability kam karti hai jo output mein pehle aa chuka ho — par ek flat, one-time penalty ke roop mein, chahe wo kitni baar aaya ho. Iska effect model ko naye words aur topics introduce karne ki taraf nudge karna hai, pehle se mentioned cheezon par atke rehne ke bajaye.

Frequency penalty ki tarah, ye lagbhag \-2.0 se 2.0 tak hoti hai (positive novelty encourage karta hai). Farak: frequency penalty repetition count ke saath badhti hai, jabki presence penalty binary hai (aaya ya nahi). Presence penalty tab use karo jab aap chahte ho ki model broader topics explore kare ya zyada diverse ideas generate kare.

**Key Interview Points**

* Penalizes any token that has appeared — a flat, one-time hit.

* Encourages introducing new words and topics.

* Range roughly \-2.0 to 2.0 (positive encourages novelty).

* Binary (appeared or not), unlike count-based frequency penalty.

* Use to broaden topics or get more diverse ideas.

**Real-World Example**

A brainstorming tool that kept circling the same few feature ideas got a presence-penalty bump. The model then branched into fresh areas — once an idea appeared, it was nudged to move on — yielding a broader, more varied list of suggestions.

**Code — Full & Runnable (Python)**

*Real OpenAI presence\_penalty code (needs an API key). The Python-runnable demo below applies a one-time presence penalty so the novelty effect is verifiable here.*

\# presence\_penalty — encourage introducing new tokens/topics (one-time penalty).  
from openai import OpenAI  
   
client \= OpenAI()  
   
def generate(prompt: str, presence\_penalty: float) \-\> str:  
    response \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        presence\_penalty=presence\_penalty,  \# range \-2.0..2.0; higher \-\> more novelty  
        messages=\[{"role": "user", "content": prompt}\],  
    )  
    return response.choices\[0\].message.content  
   
\# presence\_penalty applies a flat penalty to any token that has appeared AT ALL  
\# (regardless of count), nudging the model toward new words and fresh topics.  
\# Contrast: frequency\_penalty grows with repetition count; presence\_penalty is  
\# a one-time, binary push toward novelty.  
\# diverse \= generate("Brainstorm features for a fitness app.", presence\_penalty=0.6)

**Test / Demo & Expected Output (Python-runnable)**

\# presence penalty — penalize tokens that have appeared AT ALL (once), encouraging new topics  
base\_logits \= {"the": 2.0, "cat": 1.5, "dog": 1.4, "bird": 1.3}  
   
def apply\_presence\_penalty(logits, seen, penalty):  
    \# new\_logit \= logit \- penalty \* (1 if token already used else 0\)  
    return {t: l \- (penalty if t in seen else 0.0) for t, l in logits.items()}  
   
seen \= {"the", "cat"}                 \# these already appeared (regardless of count)  
adjusted \= apply\_presence\_penalty(base\_logits, seen, penalty=0.7)  
print("Seen tokens:", seen)  
print("Base:    ", {k: round(v, 2\) for k, v in base\_logits.items()})  
print("Adjusted:", {k: round(v, 2\) for k, v in adjusted.items()})  
print("Top token now:", max(adjusted, key=adjusted.get))  
assert adjusted\["the"\] \< base\_logits\["the"\] and adjusted\["dog"\] \== base\_logits\["dog"\]  
print("\\nPresence penalty is a flat, one-time hit for any token already used (not count-based).")  
print("Frequency penalty grows with repetition; presence penalty just pushes toward NEW tokens/topics.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Seen tokens: {'the', 'cat'}  
\# Base:     {'the': 2.0, 'cat': 1.5, 'dog': 1.4, 'bird': 1.3}  
\# Adjusted: {'the': 1.3, 'cat': 0.8, 'dog': 1.4, 'bird': 1.3}  
\# Top token now: dog  
\#   
\# Presence penalty is a flat, one-time hit for any token already used (not count-based).  
\# Frequency penalty grows with repetition; presence penalty just pushes toward NEW tokens/topics.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: How is presence penalty different from frequency penalty?**

A: Presence penalty applies a one-time, flat penalty to any token already used (regardless of count); frequency penalty scales with how many times the token has appeared. Presence pushes toward novelty; frequency curbs repetition intensity.

**Q: What's the effect of a higher presence penalty?**

A: The model is nudged to introduce new tokens/topics it hasn't used yet, broadening the range of content — useful for brainstorming and diverse output.

**Q: Can these penalties hurt output quality?**

A: Yes if set too high — the model may avoid words it genuinely needs (including key terms), making text awkward. They're best applied moderately for the specific goal of reducing repetition or increasing variety.

## **19\. Structured outputs / JSON mode**

**Simple Explanation**

Structured outputs make an LLM return data in a strict, machine-readable format — typically JSON conforming to a schema — instead of free-form prose. JSON mode guarantees valid JSON, and schema-based structured outputs go further by guaranteeing the response matches your defined fields and types.

This is essential when an LLM's output feeds the rest of a program: you can reliably parse it, validate it, and use it without brittle string handling. In Python you often pair this with Pydantic models (or JSON Schema) so the response is parsed straight into typed objects — turning the LLM into a dependable component in a data pipeline.

**Hinglish Explanation**

Structured outputs LLM ko data ek strict, machine-readable format mein return karwate hain — aksar schema ke anusaar JSON — free-form prose ke bajaye. JSON mode valid JSON guarantee karta hai, aur schema-based structured outputs aage badhte hain response ko aapke define kiye fields aur types se match karne ki guarantee de kar.

Ye essential hai jab LLM ka output baaki program ko feed karta hai: aap use reliably parse, validate aur use kar sakte ho bina brittle string handling ke. Python mein aap ise aksar Pydantic models (ya JSON Schema) ke saath pair karte ho taaki response seedhe typed objects mein parse ho — LLM ko ek data pipeline mein dependable component banakar.

**Key Interview Points**

* Make the LLM return strict, machine-readable data (usually JSON).

* JSON mode guarantees valid JSON; schema mode guarantees fields/types.

* Essential when output feeds downstream code (no brittle parsing).

* Pair with Pydantic / JSON Schema to validate and get typed objects.

* Turns the LLM into a reliable component in a data pipeline.

**Real-World Example**

An app extracts contact details from messy emails by asking the model for JSON matching a Pydantic schema (name, email, company). The response parses straight into a typed object the rest of the system uses — no fragile regex or guessing about format.

**Code — Full & Runnable (Python)**

*Real OpenAI structured-output code with Pydantic (needs an API key). The Python-runnable demo below parses and validates JSON against a schema so the enforcement is verifiable here.*

\# Structured outputs / JSON mode — get validated, typed JSON back (with Pydantic).  
from openai import OpenAI  
from pydantic import BaseModel  
   
client \= OpenAI()  
   
class Person(BaseModel):  
    name: str  
    age: int  
    skills: list\[str\]  
   
\# The Responses/Chat API can parse directly into a Pydantic schema, guaranteeing  
\# the output matches your types (no brittle string parsing).  
def extract\_person(text: str) \-\> Person:  
    completion \= client.beta.chat.completions.parse(  
        model="gpt-4o-mini",  
        messages=\[  
            {"role": "system", "content": "Extract the person's details."},  
            {"role": "user", "content": text},  
        \],  
        response\_format=Person,   \# enforce the schema  
    )  
    return completion.choices\[0\].message.parsed  
   
\# Alternatively, response\_format={"type": "json\_object"} returns valid JSON you  
\# then load with json.loads(). Structured outputs make LLMs reliable in pipelines.  
\# person \= extract\_person("Asha is 25 and knows Python and ML.")

**Test / Demo & Expected Output (Python-runnable)**

\# Structured outputs / JSON mode — force the model to emit valid, schema-conforming JSON  
import json  
   
\# Suppose the model returns this string (JSON mode guarantees valid JSON):  
raw \= '{"name": "Asha", "age": 25, "skills": \["python", "ml"\]}'  
   
schema \= {"name": str, "age": int, "skills": list}  
def validate(obj, schema):  
    errors \= \[\]  
    for field, typ in schema.items():  
        if field not in obj: errors.append(f"missing '{field}'")  
        elif not isinstance(obj\[field\], typ): errors.append(f"'{field}' must be {typ.\_\_name\_\_}")  
    return errors  
   
parsed \= json.loads(raw)                     \# guaranteed to parse in JSON mode  
errors \= validate(parsed, schema)  
print("Parsed object:", parsed)  
print("Schema errors:", errors or "none")  
print("Access fields directly: name \=", parsed\["name"\], "| first skill \=", parsed\["skills"\]\[0\])  
assert not errors, "output conforms to the schema"  
assert isinstance(parsed\["age"\], int)  
print("\\nJSON mode / structured outputs make the model return parseable, typed data your app can use.")  
print("Pair with a schema (e.g., Pydantic or JSON Schema) to validate and reduce parsing errors.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Parsed object: {'name': 'Asha', 'age': 25, 'skills': \['python', 'ml'\]}  
\# Schema errors: none  
\# Access fields directly: name \= Asha | first skill \= python  
\#   
\# JSON mode / structured outputs make the model return parseable, typed data your app can use.  
\# Pair with a schema (e.g., Pydantic or JSON Schema) to validate and reduce parsing errors.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What's the difference between JSON mode and structured outputs?**

A: JSON mode guarantees the output is valid JSON. Schema-based structured outputs additionally guarantee it matches a specific schema (defined fields and types), e.g., via a Pydantic model.

**Q: Why are structured outputs important?**

A: When an LLM's output is consumed by code, you need it in a predictable, parseable shape. Structured outputs eliminate fragile text parsing and make the model reliable inside pipelines and applications.

**Q: How do you validate the structure?**

A: Define a schema (Pydantic model or JSON Schema). The API can enforce/parse to it, and you can additionally validate fields/types in code, rejecting or retrying on mismatch.

## **20\. Output parsers**

**Simple Explanation**

Output parsers take an LLM's text response and convert it into structured data your program can use — extracting JSON, parsing a list, or mapping fields into a typed object. They handle the messy reality that models sometimes wrap JSON in prose or code fences, so parsing must be robust with fallbacks.

Frameworks like LangChain provide parsers (e.g., PydanticOutputParser) that do two things: inject format instructions into the prompt so the model knows the expected shape, and parse (and even auto-fix or retry on) the response into the target type. They're the glue between free-form generation and structured application logic.

**Hinglish Explanation**

Output parsers ek LLM ke text response ko structured data mein convert karte hain jo aapka program use kar sake — JSON extract karke, list parse karke, ya fields ko ek typed object mein map karke. Wo us messy reality ko handle karte hain ki models kabhi JSON ko prose ya code fences mein wrap karte hain, isliye parsing robust honi chahiye fallbacks ke saath.

LangChain jaise frameworks parsers dete hain (jaise PydanticOutputParser) jo do cheezein karte hain: prompt mein format instructions inject karna taaki model expected shape jaane, aur response ko target type mein parse (aur auto-fix ya retry bhi) karna. Wo free-form generation aur structured application logic ke beech ka glue hain.

**Key Interview Points**

* Convert LLM text into structured data (JSON, lists, typed objects).

* Handle messiness: JSON wrapped in prose or code fences.

* LangChain parsers inject format instructions AND parse the response.

* Can auto-fix or retry when the output doesn't match.

* The glue between free-form generation and structured app logic.

**Real-World Example**

A recipe app asks the model for a recipe and uses a PydanticOutputParser: format instructions tell the model exactly how to structure title/ingredients/steps, and the parser turns the reply into a typed Recipe object — retrying automatically if the model's first attempt is malformed.

**Code — Full & Runnable (Python)**

*Real LangChain output-parser code (needs an API key). The Python-runnable demo below parses model text into structured data with fallbacks so the behavior is verifiable here.*

\# Output parsers — convert LLM text into structured objects (LangChain).  
from langchain\_openai import ChatOpenAI  
from langchain\_core.prompts import ChatPromptTemplate  
from langchain\_core.output\_parsers import PydanticOutputParser  
from pydantic import BaseModel, Field  
   
class Recipe(BaseModel):  
    title: str \= Field(description="recipe name")  
    ingredients: list\[str\] \= Field(description="list of ingredients")  
    steps: list\[str\] \= Field(description="ordered steps")  
   
parser \= PydanticOutputParser(pydantic\_object=Recipe)  
   
prompt \= ChatPromptTemplate.from\_messages(\[  
    ("system", "Return a recipe.\\n{format\_instructions}"),  
    ("user", "{dish}"),  
\]).partial(format\_instructions=parser.get\_format\_instructions())  
   
llm \= ChatOpenAI(model="gpt-4o-mini", temperature=0)  
chain \= prompt | llm | parser   \# the parser turns the reply into a Recipe object  
   
\# Output parsers inject format instructions into the prompt and parse (and can  
\# auto-retry/fix) the response into typed Python objects.  
\# recipe \= chain.invoke({"dish": "simple pancakes"})  \# \-\> Recipe(...)

**Test / Demo & Expected Output (Python-runnable)**

\# Output parsers — turn free-form LLM text into structured data, robustly  
import json, re  
   
def parse\_json\_output(text):  
    \# Models sometimes wrap JSON in prose or \`\`\`json fences; extract it safely.  
    fenced \= re.search(r"\`\`\`(?:json)?\\s\*(\\{.\*?\\}|\\\[.\*?\\\])\\s\*\`\`\`", text, re.DOTALL)  
    candidate \= fenced.group(1) if fenced else None  
    if candidate is None:  
        m \= re.search(r"(\\{.\*\\}|\\\[.\*\\\])", text, re.DOTALL)  \# first JSON-looking blob  
        candidate \= m.group(1) if m else None  
    try:  
        return json.loads(candidate) if candidate else None  
    except json.JSONDecodeError:  
        return None  
   
def parse\_list\_output(text):  
    \# Parse a bullet/numbered list into a Python list.  
    return \[re.sub(r"^\[\\-\\\*\\d\\.\\)\\s\]+", "", ln).strip()  
            for ln in text.splitlines() if re.match(r"^\\s\*\[\\-\\\*\\d\]", ln)\]  
   
msg \= "Sure\! Here is the data:\\n\`\`\`json\\n{\\"city\\": \\"Pune\\", \\"temp\\": 30}\\n\`\`\`"  
listmsg \= "Top languages:\\n1. Python\\n2. JavaScript\\n- Go"  
print("Parsed JSON:", parse\_json\_output(msg))  
print("Parsed list:", parse\_list\_output(listmsg))  
assert parse\_json\_output(msg) \== {"city": "Pune", "temp": 30}  
assert parse\_list\_output(listmsg) \== \["Python", "JavaScript", "Go"\]  
print("\\nOutput parsers extract structured data (JSON, lists, key-values) from model text, with fallbacks.")  
print("Frameworks like LangChain provide parsers (e.g., PydanticOutputParser) that also fix/retry on errors.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Parsed JSON: {'city': 'Pune', 'temp': 30}  
\# Parsed list: \['Python', 'JavaScript', 'Go'\]  
\#   
\# Output parsers extract structured data (JSON, lists, key-values) from model text, with fallbacks.  
\# Frameworks like LangChain provide parsers (e.g., PydanticOutputParser) that also fix/retry on errors.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What do output parsers do?**

A: They transform an LLM's text into structured data (e.g., a Pydantic object or list), often injecting format instructions into the prompt and robustly parsing — with fallbacks/retries — the response.

**Q: Why not just call json.loads on the response?**

A: Models may add prose, code fences, or slightly malformed JSON. Parsers handle extraction and error recovery, and can re-prompt the model to fix output that doesn't match the schema.

**Q: How do parsers relate to structured outputs / JSON mode?**

A: Structured outputs constrain the model to emit conforming JSON; parsers handle turning responses into typed objects and recovering from imperfections. They're complementary — used together for maximum reliability.

## **21\. Streaming LLM responses**

**Simple Explanation**

Streaming returns the model's output incrementally — token by token — as it's generated, instead of waiting for the entire response to finish. Technically the API sends a stream of chunks (server-sent events) that the client renders immediately, producing the familiar 'typewriter' effect.

The big win is perceived latency: users see words appear within a fraction of a second rather than staring at a spinner for the whole generation. In Python you set stream=True and iterate over the response chunks, appending each delta to build the full text. Streaming is standard for chat UIs and any long-form generation.

**Hinglish Explanation**

Streaming model ka output incrementally return karta hai — token by token — jaise wo generate hota hai, poore response ke khatam hone ka wait kiye bina. Technically API chunks ka ek stream (server-sent events) bhejta hai jise client turant render karta hai, jaana-pehchana 'typewriter' effect produce karke.

Bada faayda perceived latency hai: users words ko ek second ke fraction mein appear hote dekhte hain, poore generation ke liye spinner ghoorne ke bajaye. Python mein aap stream=True set karte ho aur response chunks par iterate karte ho, har delta ko append karke full text banate ho. Streaming chat UIs aur kisi bhi long-form generation ke liye standard hai.

**Key Interview Points**

* Returns output incrementally (token by token) as it's generated.

* API sends chunks (server-sent events); client renders immediately.

* Dramatically improves perceived latency (typewriter effect).

* Python: set stream=True and iterate over response chunks.

* Standard for chat UIs and long-form generation.

**Real-World Example**

A chat assistant streams its answer so the user reads along as it's written, rather than waiting several seconds for a long reply to appear all at once — making the app feel fast and alive even when total generation time is unchanged.

**Code — Full & Runnable (Python)**

*Real OpenAI streaming code (needs an API key). The Python-runnable demo below consumes a token stream so the incremental behavior is verifiable here.*

\# Streaming LLM responses — render tokens as they arrive (lower perceived latency).  
from openai import OpenAI  
   
client \= OpenAI()  
   
def stream\_answer(prompt: str):  
    stream \= client.chat.completions.create(  
        model="gpt-4o-mini",  
        messages=\[{"role": "user", "content": prompt}\],  
        stream=True,   \# yield partial chunks instead of waiting for the full reply  
    )  
    full \= \[\]  
    for chunk in stream:  
        delta \= chunk.choices\[0\].delta.content  
        if delta:  
            print(delta, end="", flush=True)  \# render immediately (typewriter effect)  
            full.append(delta)  
    return "".join(full)  
   
\# Streaming sends tokens incrementally (server-sent events). The UI updates live,  
\# greatly improving responsiveness for long answers.  
\# stream\_answer("Write a short story about a robot.")

**Test / Demo & Expected Output (Python-runnable)**

\# Streaming LLM responses — yield tokens as they're generated for instant feedback  
import time  
def stream\_response(text):  
    \# A generator that yields tokens one at a time (like an SSE/stream from the API).  
    for token in text.split():  
        yield token \+ " "  
   
\# Consumer accumulates the stream (a UI would render each chunk immediately).  
collected \= ""  
chunks \= 0  
for chunk in stream\_response("Streaming shows tokens as they arrive"):  
    collected \+= chunk  
    chunks \+= 1  
    \# print(chunk, end="", flush=True)  \# real UI: render incrementally  
print("Received", chunks, "streamed chunks")  
print("Final text:", collected.strip())  
assert chunks \== 6 and collected.strip() \== "Streaming shows tokens as they arrive"  
print("\\nStreaming sends partial output token-by-token (server-sent events) instead of waiting for the full reply.")  
print("Benefits: lower perceived latency and a responsive, typewriter-style UX.")  
print("In Python: set stream=True and iterate the response chunks; the client renders them as they come.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Received 6 streamed chunks  
\# Final text: Streaming shows tokens as they arrive  
\#   
\# Streaming sends partial output token-by-token (server-sent events) instead of waiting for the full reply.  
\# Benefits: lower perceived latency and a responsive, typewriter-style UX.  
\# In Python: set stream=True and iterate the response chunks; the client renders them as they come.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What's the main benefit of streaming?**

A: Lower perceived latency and a responsive UX — users see output appear immediately (token by token) instead of waiting for the full response, even though total generation time is the same.

**Q: How do you consume a stream in Python?**

A: Set stream=True on the request and iterate over the returned chunks, reading each delta (partial content) and appending it; the UI renders each piece as it arrives.

**Q: What transport does streaming typically use?**

A: Server-sent events (SSE) over HTTP — the server pushes a sequence of chunks on one long-lived response, which the client reads incrementally.

## **22\. Function calling**

**Simple Explanation**

Function calling lets an LLM invoke your code with structured arguments. You describe available functions (name, parameters as a JSON schema); the model decides when to call one and returns the function name plus JSON arguments. Your application executes the real function and feeds the result back so the model can produce a final answer.

Crucially, the model doesn't run the function — it only requests the call; you control execution. This bridges the LLM to real data and actions: fetching weather, querying a database, sending an email. The flow is: define schemas → model emits a call → you execute → return the result → model replies in natural language.

**Hinglish Explanation**

Function calling ek LLM ko aapke code ko structured arguments ke saath invoke karne deta hai. Aap available functions describe karte ho (name, parameters JSON schema ke roop mein); model decide karta hai kab call kare aur function name plus JSON arguments return karta hai. Aapki application real function execute karti hai aur result wapas feed karti hai taaki model final answer bana sake.

Khaas baat: model function run nahi karta — ye sirf call request karta hai; execution aap control karte ho. Ye LLM ko real data aur actions se jodta hai: weather fetch karna, database query karna, email bhejna. Flow: schemas define karo → model ek call emit kare → aap execute karo → result return karo → model natural language mein reply kare.

**Key Interview Points**

* Describe functions (name \+ JSON-schema parameters) to the model.

* The model returns a function name \+ JSON arguments when relevant.

* Your app executes the real function — the model never runs it.

* Feed the result back so the model produces a final answer.

* Bridges the LLM to real data/actions (APIs, DBs, etc.).

**Real-World Example**

A weather assistant: the user asks 'What's it like in Pune?', the model returns a call to get\_weather(city='Pune'), the app runs the real weather API, returns the data, and the model replies 'It's 31°C and sunny in Pune.' — grounded in live data, not guesswork.

**Code — Full & Runnable (Python)**

*Real OpenAI function-calling code (needs an API key). The Python-runnable demo below simulates the call → execute → respond loop so the mechanism is verifiable here.*

\# Function calling — let the model call your Python function with structured args.  
import json  
from openai import OpenAI  
   
client \= OpenAI()  
   
def get\_weather(city: str) \-\> dict:  
    return {"city": city, "temp\_c": 31, "condition": "sunny"}  
   
tools \= \[{  
    "type": "function",  
    "function": {  
        "name": "get\_weather",  
        "description": "Get current weather for a city",  
        "parameters": {  
            "type": "object",  
            "properties": {"city": {"type": "string"}},  
            "required": \["city"\],  
        },  
    },  
}\]  
   
def ask(user\_message: str) \-\> str:  
    messages \= \[{"role": "user", "content": user\_message}\]  
    first \= client.chat.completions.create(model="gpt-4o-mini", messages=messages, tools=tools)  
    msg \= first.choices\[0\].message  
    if msg.tool\_calls:  
        call \= msg.tool\_calls\[0\]  
        args \= json.loads(call.function.arguments)  
        result \= get\_weather(\*\*args)                 \# YOU execute the function  
        messages \+= \[msg, {"role": "tool", "tool\_call\_id": call.id, "content": json.dumps(result)}\]  
        second \= client.chat.completions.create(model="gpt-4o-mini", messages=messages)  
        return second.choices\[0\].message.content     \# model answers using the result  
    return msg.content

**Test / Demo & Expected Output (Python-runnable)**

\# Function calling — the model returns a structured call; your code executes it  
import json  
\# 1\) You describe available functions (name, params) to the model.  
function\_schema \= {  
    "name": "get\_weather",  
    "parameters": {"type": "object", "properties": {"city": {"type": "string"}}, "required": \["city"\]},  
}  
\# 2\) The model decides to call it and returns JSON arguments (simulated here).  
model\_function\_call \= {"name": "get\_weather", "arguments": json.dumps({"city": "Pune"})}  
   
\# 3\) Your app actually runs the real function.  
def get\_weather(city): return {"city": city, "temp\_c": 31, "condition": "sunny"}  
   
name \= model\_function\_call\["name"\]  
args \= json.loads(model\_function\_call\["arguments"\])  
result \= get\_weather(\*\*args)  
print("Model asked to call:", name, "with", args)  
print("Function result:", result)  
\# 4\) You feed the result back to the model for a natural-language answer.  
final\_answer \= f"It's {result\['temp\_c'\]}\\u00b0C and {result\['condition'\]} in {result\['city'\]}."  
print("Final answer:", final\_answer)  
assert name \== "get\_weather" and result\["temp\_c"\] \== 31  
print("\\nFunction calling lets the LLM invoke your code with structured args to fetch data or take actions.")  
print("Flow: define schema \-\> model emits a call \-\> you execute \-\> return result \-\> model replies.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Model asked to call: get\_weather with {'city': 'Pune'}  
\# Function result: {'city': 'Pune', 'temp\_c': 31, 'condition': 'sunny'}  
\# Final answer: It's 31°C and sunny in Pune.  
\#   
\# Function calling lets the LLM invoke your code with structured args to fetch data or take actions.  
\# Flow: define schema \-\> model emits a call \-\> you execute \-\> return result \-\> model replies.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Does the model execute the function itself?**

A: No — it only returns a structured request (the function name and JSON arguments). Your application is responsible for executing the function and returning the result to the model.

**Q: How does the model know which function to call?**

A: You provide each function's name, description, and parameter schema. The model matches the user's intent to a function and produces arguments conforming to its schema.

**Q: What is function calling used for?**

A: Connecting LLMs to real data and actions — fetching info from APIs/databases, performing operations, and returning structured data — turning a text model into an app that can do things.

## **23\. Tool calling**

**Simple Explanation**

Tool calling is function calling generalized to multiple tools: you give the model a set of tools (each with a name and schema), and it selects the right one(s) for the task, returns the call(s), and — after you execute them and return results — can call more tools in a loop until it can answer. 'Tool' is the modern term; the mechanism is the same as function calling.

This loop — the model choosing tools, observing results, and continuing — is the foundation of AI agents. With tools like search, a calculator, a database query, or an API client, the LLM can chain multiple actions to accomplish complex tasks it couldn't do from its weights alone.

**Hinglish Explanation**

Tool calling function calling ka multiple tools tak generalized version hai: aap model ko tools ka ek set dete ho (har ek name aur schema ke saath), aur ye task ke liye sahi tool(s) select karta hai, call(s) return karta hai, aur — aapke unhe execute karke results return karne ke baad — ek loop mein aur tools call kar sakta hai jab tak answer na de sake. 'Tool' modern term hai; mechanism function calling jaisa hi hai.

Ye loop — model tools choose karta hai, results observe karta hai, aur continue karta hai — AI agents ka aadhaar hai. Search, calculator, database query, ya API client jaise tools ke saath, LLM complex tasks accomplish karne ke liye multiple actions chain kar sakta hai jo wo akele apne weights se nahi kar sakta.

**Key Interview Points**

* Function calling generalized to a set of multiple tools.

* The model picks the right tool(s), returns calls, and can loop.

* You execute each tool and return results; the model continues.

* 'Tool' is the modern term; same mechanism as function calling.

* The tool-use loop is the foundation of AI agents.

**Real-World Example**

An assistant with search, a calculator, and a calendar tool answers 'How many days until my next meeting, and what's 15% of the budget?' by calling the calendar tool, then the calculator, combining both observations into one answer — routing to the right tool for each part.

**Code — Full & Runnable (Python)**

*Real OpenAI tool-calling loop code (needs an API key). The Python-runnable demo below routes among multiple tools so the selection logic is verifiable here.*

\# Tool calling — register multiple tools; the model picks and may chain them.  
import json  
from openai import OpenAI  
   
client \= OpenAI()  
   
def get\_weather(city): return {"temp\_c": 31, "condition": "sunny"}  
def calculator(expression): return {"result": eval(expression, {"\_\_builtins\_\_": {}})}  
REGISTRY \= {"get\_weather": get\_weather, "calculator": calculator}  
   
tools \= \[  
    {"type": "function", "function": {"name": "get\_weather",  
        "parameters": {"type": "object", "properties": {"city": {"type": "string"}}, "required": \["city"\]}}},  
    {"type": "function", "function": {"name": "calculator",  
        "parameters": {"type": "object", "properties": {"expression": {"type": "string"}}, "required": \["expression"\]}}},  
\]  
   
def run(user\_message: str) \-\> str:  
    messages \= \[{"role": "user", "content": user\_message}\]  
    while True:  
        resp \= client.chat.completions.create(model="gpt-4o-mini", messages=messages, tools=tools)  
        msg \= resp.choices\[0\].message  
        if not msg.tool\_calls:  
            return msg.content                       \# done: final natural-language answer  
        messages.append(msg)  
        for call in msg.tool\_calls:                  \# the model may call several tools  
            fn \= REGISTRY\[call.function.name\]  
            result \= fn(\*\*json.loads(call.function.arguments))  
            messages.append({"role": "tool", "tool\_call\_id": call.id, "content": json.dumps(result)})  
   
\# Tool calling is the foundation of agents: the model routes to tools, observes  
\# results, and loops until it can answer.

**Test / Demo & Expected Output (Python-runnable)**

\# Tool calling — give the model several tools; it picks the right one (often in a loop)  
import json  
def get\_weather(city): return f"{city}: 31C sunny"  
def calculator(expression): return str(eval(expression, {"\_\_builtins\_\_": {}}))  
def web\_search(query): return f"results for '{query}'"  
TOOLS \= {"get\_weather": get\_weather, "calculator": calculator, "web\_search": web\_search}  
   
def model\_choose\_tool(user\_msg):  
    \# The model selects a tool \+ arguments based on the request (simulated routing).  
    if "weather" in user\_msg: return {"tool": "get\_weather", "args": {"city": "Pune"}}  
    if any(c.isdigit() for c in user\_msg) and any(op in user\_msg for op in "+-\*/"):  
        return {"tool": "calculator", "args": {"expression": "12 \* 7"}}  
    return {"tool": "web\_search", "args": {"query": user\_msg}}  
   
for msg in \["what's the weather?", "compute 12 \* 7", "who won the cup?"\]:  
    choice \= model\_choose\_tool(msg)  
    output \= TOOLS\[choice\["tool"\]\](\*\*choice\["args"\])  
    print(f"{msg\!r} \-\> tool={choice\['tool'\]} \-\> {output}")  
   
c \= model\_choose\_tool("compute 12 \* 7")  
assert c\["tool"\] \== "calculator" and TOOLS\[c\["tool"\]\](\*\*c\["args"\]) \== "84"  
print("\\nTool calling \= function calling with MANY tools; the model routes to the right one and may chain calls.")  
print("This is the backbone of AI agents: perceive \-\> choose tool \-\> act \-\> observe \-\> repeat.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# "what's the weather?" \-\> tool=get\_weather \-\> Pune: 31C sunny  
\# 'compute 12 \* 7' \-\> tool=calculator \-\> 84  
\# 'who won the cup?' \-\> tool=web\_search \-\> results for 'who won the cup?'  
\#   
\# Tool calling \= function calling with MANY tools; the model routes to the right one and may chain calls.  
\# This is the backbone of AI agents: perceive \-\> choose tool \-\> act \-\> observe \-\> repeat.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: How is tool calling different from function calling?**

A: It's essentially the same mechanism applied to multiple tools. The model chooses among several tools (and may call them in sequence) rather than a single function. 'Tools' is the current terminology.

**Q: Why is tool calling the basis of agents?**

A: Agents perceive a task, choose and call tools, observe results, and repeat until done. Tool calling provides exactly that loop, letting the LLM take real actions and chain steps autonomously.

**Q: Can the model call multiple tools for one request?**

A: Yes — it can call several tools across multiple turns of the loop, using each result to decide the next call, until it has enough information to produce a final answer.

## **24\. What are embeddings**

**Simple Explanation**

An embedding is a vector of numbers that represents the meaning of a piece of text (or an image, etc.) in a high-dimensional space. An embedding model maps text so that semantically similar inputs land close together and dissimilar ones land far apart — 'king' and 'queen' are near each other; 'king' and 'apple' are far.

Because meaning becomes geometry, you can compare texts numerically (typically with cosine similarity) to find related content. Embeddings are the foundation of semantic search, RAG retrieval, clustering, deduplication, and recommendations — anywhere you need to compare text by meaning rather than exact keywords.

**Hinglish Explanation**

Embedding numbers ka ek vector hai jo ek text (ya image, etc.) ke meaning ko ek high-dimensional space mein represent karta hai. Ek embedding model text ko aise map karta hai ki semantically similar inputs paas aayein aur dissimilar door — 'king' aur 'queen' paas hain; 'king' aur 'apple' door.

Kyunki meaning geometry ban jaata hai, aap texts ko numerically compare kar sakte ho (aksar cosine similarity se) related content dhoondhne ke liye. Embeddings semantic search, RAG retrieval, clustering, deduplication aur recommendations ka aadhaar hain — jahan bhi aapko text ko meaning se compare karna ho, exact keywords ke bajaye.

**Key Interview Points**

* A numeric vector representing the meaning of text (or other data).

* Semantically similar inputs land close; dissimilar ones land far.

* Compare with cosine similarity to find related content.

* Meaning becomes geometry — enabling search by meaning, not keywords.

* Foundation of semantic search, RAG, clustering, and recommendations.

**Real-World Example**

A help center embeds every article and the user's question, then finds the articles whose vectors are closest to the question's — surfacing relevant help even when the user's wording doesn't match the article's keywords (e.g., 'can't log in' matches an article titled 'authentication issues').

**Code — Full & Runnable (Python)**

*Real OpenAI embeddings code with NumPy (needs an API key). The Python-runnable demo below computes cosine similarity over toy vectors so the 'similar meaning \= close vectors' idea is verifiable here.*

\# What are embeddings — turn text into vectors with an embeddings model.  
from openai import OpenAI  
import numpy as np  
   
client \= OpenAI()  
   
def embed(text: str) \-\> list\[float\]:  
    resp \= client.embeddings.create(model="text-embedding-3-small", input=text)  
    return resp.data\[0\].embedding   \# e.g., a 1536-dimensional vector  
   
def cosine\_similarity(a, b):  
    a, b \= np.array(a), np.array(b)  
    return float(a @ b / (np.linalg.norm(a) \* np.linalg.norm(b)))  
   
\# Semantically similar texts produce vectors that are close (high cosine similarity).  
\# king \= embed("king"); queen \= embed("queen"); apple \= embed("apple")  
\# cosine\_similarity(king, queen)  \-\> high  
\# cosine\_similarity(king, apple)  \-\> low  
\#  
\# Embeddings power semantic search, RAG retrieval, clustering, deduplication,  
\# and recommendations — anywhere you need "meaning-based" comparison of text.

**Test / Demo & Expected Output (Python-runnable)**

\# What are embeddings — text mapped to vectors where similar meanings are close  
import math  
\# Toy 3-dim "semantic" vectors (real embeddings have hundreds/thousands of dims).  
embeddings \= {  
    "king":   \[0.9, 0.8, 0.1\],  
    "queen":  \[0.9, 0.75, 0.15\],  
    "man":    \[0.8, 0.2, 0.1\],  
    "apple":  \[0.1, 0.1, 0.9\],  
    "banana": \[0.15, 0.12, 0.85\],  
}  
def cosine(a, b):  
    dot \= sum(x\*y for x, y in zip(a, b))  
    na \= math.sqrt(sum(x\*x for x in a)); nb \= math.sqrt(sum(y\*y for y in b))  
    return dot / (na \* nb)  
   
def most\_similar(word):  
    return sorted(((w, cosine(embeddings\[word\], v)) for w, v in embeddings.items() if w \!= word),  
                  key=lambda kv: kv\[1\], reverse=True)  
   
print("Closest to 'king': ", \[(w, round(s, 3)) for w, s in most\_similar("king")\]\[:2\])  
print("Closest to 'apple':", \[(w, round(s, 3)) for w, s in most\_similar("apple")\]\[:2\])  
assert most\_similar("king")\[0\]\[0\] \== "queen", "king is closest to queen"  
assert most\_similar("apple")\[0\]\[0\] \== "banana", "apple is closest to banana"  
print("\\nEmbeddings turn text into numeric vectors capturing meaning; similar text \-\> nearby vectors.")  
print("They power semantic search, RAG retrieval, clustering, and recommendations.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Closest to 'king':  \[('queen', 0.999), ('man', 0.887)\]  
\# Closest to 'apple': \[('banana', 0.998), ('queen', 0.279)\]  
\#   
\# Embeddings turn text into numeric vectors capturing meaning; similar text \-\> nearby vectors.  
\# They power semantic search, RAG retrieval, clustering, and recommendations.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What does an embedding represent?**

A: The semantic meaning of input as a point (vector) in a high-dimensional space, arranged so that similar meanings are nearby and different meanings are far apart.

**Q: How do you measure similarity between embeddings?**

A: Most commonly cosine similarity (the cosine of the angle between vectors), which captures directional similarity regardless of magnitude. Higher cosine \= more similar meaning.

**Q: What are embeddings used for?**

A: Semantic search, RAG retrieval, clustering, deduplication, classification, and recommendations — any task that benefits from comparing items by meaning rather than exact text match.

## **25\. Vectorization**

**Simple Explanation**

Vectorization is the general process of converting data — here, text — into numeric vectors that algorithms can compute on. It's the bridge from human-readable content to the math of similarity, search, and machine learning, since models and vector databases operate on numbers, not raw text.

Classic techniques like bag-of-words and TF-IDF produce sparse, count-based vectors that capture which terms appear. Modern neural embeddings produce dense vectors that capture meaning. In GenAI applications, 'vectorization' usually means generating embeddings for your text so it can be stored in a vector database and retrieved by semantic similarity.

**Hinglish Explanation**

Vectorization data — yahan text — ko numeric vectors mein convert karne ka general process hai jin par algorithms compute kar sakte hain. Ye human-readable content se similarity, search aur machine learning ke math tak ka bridge hai, kyunki models aur vector databases numbers par operate karte hain, raw text par nahi.

Classic techniques jaise bag-of-words aur TF-IDF sparse, count-based vectors banate hain jo capture karte hain kaun se terms aate hain. Modern neural embeddings dense vectors banate hain jo meaning capture karte hain. GenAI applications mein, 'vectorization' aksar matlab aapke text ke liye embeddings generate karna taaki use ek vector database mein store karke semantic similarity se retrieve kiya ja sake.

**Key Interview Points**

* Converting text (or other data) into numeric vectors for computation.

* The bridge from raw content to similarity/search/ML math.

* Classic: bag-of-words, TF-IDF (sparse, term-count based).

* Modern: neural embeddings (dense, meaning-capturing).

* In GenAI it usually means generating embeddings for storage/retrieval.

**Real-World Example**

Building a RAG system, a team vectorizes thousands of document chunks with an embedding model and stores the vectors in a vector database. At query time the question is vectorized the same way, and the closest chunk vectors are retrieved — all enabled by the initial vectorization step.

**Code — Full & Runnable (Python)**

*Real OpenAI embeddings \+ scikit-learn TF-IDF code. The Python-runnable demo below builds bag-of-words vectors so the text-to-vector step is verifiable here.*

\# Vectorization — convert text to numeric vectors for similarity/search.  
\# Modern approach: neural embeddings (preferred for semantic meaning).  
from openai import OpenAI  
client \= OpenAI()  
   
def vectorize(texts: list\[str\]) \-\> list\[list\[float\]\]:  
    resp \= client.embeddings.create(model="text-embedding-3-small", input=texts)  
    return \[d.embedding for d in resp.data\]   \# batch-vectorize many texts at once  
   
\# Classic approach (no model): TF-IDF turns a corpus into sparse count-based vectors.  
from sklearn.feature\_extraction.text import TfidfVectorizer  
   
corpus \= \["the cat sat", "the dog ran", "the cat ran fast"\]  
tfidf \= TfidfVectorizer()  
matrix \= tfidf.fit\_transform(corpus)          \# rows \= documents, columns \= terms  
\# print(tfidf.get\_feature\_names\_out()); print(matrix.toarray())  
   
\# Vectorization is the bridge from text to math: once text is a vector you can  
\# measure similarity, cluster, retrieve, or feed it to downstream ML models.  
\# Neural embeddings capture meaning; TF-IDF/bag-of-words capture surface terms.

**Test / Demo & Expected Output (Python-runnable)**

\# Vectorization — converting text into a numeric vector the model/DB can compare  
def build\_vocab(docs):  
    vocab \= {}  
    for d in docs:  
        for w in d.lower().split():  
            vocab.setdefault(w, len(vocab))  
    return vocab  
   
def vectorize(text, vocab):  
    \# Bag-of-words count vector (a simple, classic vectorization).  
    vec \= \[0\] \* len(vocab)  
    for w in text.lower().split():  
        if w in vocab: vec\[vocab\[w\]\] \+= 1  
    return vec  
   
docs \= \["the cat sat", "the dog ran", "the cat ran fast"\]  
vocab \= build\_vocab(docs)  
print("Vocabulary:", vocab)  
for d in docs:  
    print(f"{d\!r} \-\> {vectorize(d, vocab)}")  
v \= vectorize("the cat sat", vocab)  
assert len(v) \== len(vocab), "vector length equals vocabulary size"  
assert v\[vocab\["the"\]\] \== 1 and v\[vocab\["cat"\]\] \== 1  
print("\\nVectorization converts raw text into numbers (here bag-of-words; modern apps use neural embeddings).")  
print("Once text is a vector, you can measure similarity, search, and feed it to ML models.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Vocabulary: {'the': 0, 'cat': 1, 'sat': 2, 'dog': 3, 'ran': 4, 'fast': 5}  
\# 'the cat sat' \-\> \[1, 1, 1, 0, 0, 0\]  
\# 'the dog ran' \-\> \[1, 0, 0, 1, 1, 0\]  
\# 'the cat ran fast' \-\> \[1, 1, 0, 0, 1, 1\]  
\#   
\# Vectorization converts raw text into numbers (here bag-of-words; modern apps use neural embeddings).  
\# Once text is a vector, you can measure similarity, search, and feed it to ML models.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What's the difference between vectorization and embeddings?**

A: Vectorization is the general act of turning data into numeric vectors. Embeddings are a specific kind — dense, meaning-capturing vectors from a neural model. In GenAI, vectorization usually means generating embeddings.

**Q: TF-IDF vs neural embeddings?**

A: TF-IDF makes sparse vectors based on term frequency (surface words), good for keyword matching. Neural embeddings make dense vectors capturing semantic meaning, enabling matches even when wording differs.

**Q: Why vectorize text at all?**

A: Because models, similarity metrics, and vector databases work on numbers. Vectorization turns text into a form you can search, cluster, classify, and retrieve by similarity.