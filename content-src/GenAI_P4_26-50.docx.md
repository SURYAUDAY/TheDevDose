  
**Generative AI \+ RAG \+ Agents**

Interview Study Guide

Phase 4  ·  Topics 26–50 of 75

Full-Stack \+ GenAI Roadmap

Code language: Python

**How to run the code samples**

API code: runs with Python \+ the listed packages (openai, langchain, chromadb, etc.) and a valid API key where required.

Logic demos: save as filename.py, then run  python3 filename.py

**Table of Contents**

# **Generative AI \+ RAG \+ Agents**

This guide covers topics 26 to 50 of Phase 4, moving from embeddings into retrieval and the core of RAG. It begins with how embeddings are generated and how to choose an embedding model, then the similarity math that powers everything (cosine similarity, similarity search, semantic search). It walks through vector databases (Pinecone, ChromaDB, FAISS, and alternatives like pgvector, Qdrant and Weaviate), then builds up Retrieval-Augmented Generation end to end: what RAG is, document loaders and parsing, chunking and chunking strategies, indexing, the retrieval pipeline, semantic retrieval, context injection, reranking and cross-encoders, hybrid search, agentic RAG, and RAG evaluation with RAGAS. It closes with the LangChain essentials used to wire it all together (chains and prompt templates).

Each topic follows the same structure: a plain-English explanation, the same idea in spoken Hinglish, key interview points, a real-world example, full Python code, a Python-runnable logic demo with verified expected output, and common follow-up questions. For topics that require a live LLM API, the code shows the real, idiomatic implementation (with openai / langchain / etc.) and the demo verifies the underlying logic in plain Python so the output is reproducible without an API key.

## **26\. Embedding generation**

**Simple Explanation**

Embedding generation is the step of running text through an embedding model to produce its vector representation. For a given model and input, it's deterministic — the same text always yields the same vector — and the output dimension is fixed by the model (e.g., 1536 for text-embedding-3-small).

In practice you generate embeddings for every document chunk once (then store them) and for each incoming query at search time. Batching many texts in a single request is far cheaper and faster than one call per text. Crucially, you must embed documents and queries with the same model so they live in the same vector space.

**Hinglish Explanation**

Embedding generation wo step hai jisme text ko ek embedding model se chalakar uska vector representation banate hain. Ek diye gaye model aur input ke liye, ye deterministic hai — same text hamesha same vector deta hai — aur output dimension model se fixed hota hai (jaise text-embedding-3-small ke liye 1536).

Practically aap har document chunk ke liye embeddings ek baar generate karte ho (phir store karte ho) aur har incoming query ke liye search time par. Ek hi request mein bahut saare texts batch karna ek-ek call se kahin cheaper aur faster hai. Khaas baat: documents aur queries ko same model se embed karna chahiye taaki wo same vector space mein hon.

**Key Interview Points**

* Run text through an embedding model to get its vector.

* Deterministic for a given model+input; fixed output dimension.

* Embed document chunks once (store them); embed queries at search time.

* Batch many texts per request for big cost/speed savings.

* Use the SAME model for documents and queries (same vector space).

**Real-World Example**

When building a RAG system over 10,000 docs, a team batches the chunks and generates all embeddings up front, storing them in a vector DB. At query time they embed only the user's question — with the same model — so it can be compared against the stored vectors.

**Code — Full & Runnable (Python)**

*Real OpenAI embeddings code (needs an API key). The Python-runnable demo below generates deterministic, normalized vectors and batches them, so the process is verifiable here.*

\# Embedding generation — create vectors from text with an embeddings API (batched).  
from openai import OpenAI  
client \= OpenAI()  
   
def generate\_embeddings(texts: list\[str\]) \-\> list\[list\[float\]\]:  
    \# Batch many texts in one call \\u2014 far cheaper/faster than one call per text.  
    resp \= client.embeddings.create(model="text-embedding-3-small", input=texts)  
    return \[item.embedding for item in resp.data\]  
   
\# Open-source alternative (runs locally, no API key) with sentence-transformers:  
\# from sentence\_transformers import SentenceTransformer  
\# model \= SentenceTransformer("all-MiniLM-L6-v2")  
\# vectors \= model.encode(texts, normalize\_embeddings=True)  
   
chunks \= \["Refunds take 5 days.", "Shipping is free over $50."\]  
\# vectors \= generate\_embeddings(chunks)   \# \-\> list of 1536-dim vectors  
\# Tip: normalize vectors and use the SAME model for documents and queries.

**Test / Demo & Expected Output (Python-runnable)**

\# Embedding generation — turning text into a fixed-length vector (deterministic toy model)  
import hashlib, math  
   
def embed(text, dim=8):  
    \# A toy, deterministic embedding: hash each word into the vector (bag-of-hashed-words).  
    \# Real models are neural nets; this just shows text \-\> fixed-length numeric vector.  
    vec \= \[0.0\] \* dim  
    for word in text.lower().split():  
        h \= int(hashlib.md5(word.encode()).hexdigest(), 16\)  
        vec\[h % dim\] \+= 1.0  
    norm \= math.sqrt(sum(x \* x for x in vec)) or 1.0  
    return \[round(x / norm, 3\) for x in vec\]   \# L2-normalized  
   
for t in \["the cat sat", "the cat sat", "a dog ran fast"\]:  
    print(f"{t\!r:24} \-\> {embed(t)}")  
   
a, b \= embed("the cat sat"), embed("the cat sat")  
c \= embed("a dog ran fast")  
assert a \== b, "embedding generation is deterministic for the same input"  
assert a \!= c, "different text yields a different vector"  
assert abs(math.sqrt(sum(x\*x for x in a)) \- 1.0) \< 1e-2, "vector is \~normalized (rounding aside)"  
print("Embedding generation maps any text to a fixed-length vector; same input \-\> same vector.")  
print("Real embedding models are batched API/model calls; normalize vectors for fair comparison.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# 'the cat sat'            \-\> \[0.577, 0.0, 0.0, 0.0, 0.577, 0.0, 0.0, 0.577\]  
\# 'the cat sat'            \-\> \[0.577, 0.0, 0.0, 0.0, 0.577, 0.0, 0.0, 0.577\]  
\# 'a dog ran fast'         \-\> \[0.0, 0.5, 0.5, 0.5, 0.0, 0.5, 0.0, 0.0\]  
\# Embedding generation maps any text to a fixed-length vector; same input \-\> same vector.  
\# Real embedding models are batched API/model calls; normalize vectors for fair comparison.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why batch embedding requests?**

A: Sending many texts in one request reduces overhead and cost and is much faster than one request per text — important when embedding thousands of chunks.

**Q: Must documents and queries use the same embedding model?**

A: Yes. Vectors are only comparable within the same model's space. Mixing models (or dimensions) makes similarity scores meaningless.

**Q: Is embedding generation deterministic?**

A: For a fixed model and input, yes — the same text produces the same vector, which is what lets you store and reliably re-query embeddings.

## **27\. Embedding model selection**

**Simple Explanation**

Choosing an embedding model means balancing quality, vector dimensions, cost, latency, and language/domain fit. Higher-quality models (check the MTEB leaderboard) retrieve more relevant results, but larger dimensions mean more storage and slower search, and hosted APIs bill per token while self-hosted models trade that for infrastructure.

Practical guidance: smaller-dimensional models are cheaper to store and faster to search; multilingual or domain-tuned models matter when your content isn't general English; and consistency is essential — once you pick a model, you must use it for both documents and queries (and re-embed everything if you switch).

**Hinglish Explanation**

Embedding model choose karna matlab quality, vector dimensions, cost, latency, aur language/domain fit ko balance karna. Higher-quality models (MTEB leaderboard dekho) zyada relevant results retrieve karte hain, par bade dimensions matlab zyada storage aur slower search, aur hosted APIs per token bill karte hain jabki self-hosted models uske badle infrastructure lete hain.

Practical guidance: chhote-dimensional models store karne mein cheaper aur search mein faster hain; multilingual ya domain-tuned models tab matter karte hain jab content general English na ho; aur consistency essential hai — ek baar model pick karne ke baad, use documents aur queries dono ke liye use karna padega (aur switch karo to sab re-embed karna padega).

**Key Interview Points**

* Balance quality, dimensions, cost, latency, and language/domain fit.

* Check the MTEB leaderboard for quality on your task/language.

* Fewer dimensions \= cheaper storage \+ faster search.

* Hosted bills per token; self-hosted trades cost for infrastructure.

* Switching models means re-embedding everything — commit deliberately.

**Real-World Example**

A startup on a tight budget self-hosts all-MiniLM-L6-v2 (384 dims, free) for its English-only FAQ search. A later multilingual product switches to a hosted multilingual model for quality — accepting the re-embedding cost because retrieval accuracy matters more than infra savings there.

**Code — Full & Runnable (Python)**

*Real OpenAI (hosted) and sentence-transformers (self-hosted) code. The Python-runnable demo below scores models by cost/quality/size so the selection logic is verifiable here.*

\# Embedding model selection — choose by quality, dimensions, cost, speed, and domain.  
\# OpenAI offers a small/cheap and a large/accurate model; dimensions are configurable.  
from openai import OpenAI  
client \= OpenAI()  
   
def embed(texts, model="text-embedding-3-small", dimensions=None):  
    kwargs \= {"model": model, "input": texts}  
    if dimensions:  
        kwargs\["dimensions"\] \= dimensions   \# 3-\* models can shorten output dims to save space  
    return \[d.embedding for d in client.embeddings.create(\*\*kwargs).data\]  
   
\# Selection guidance:  
\#   text-embedding-3-small : cheaper, faster, good default (1536 dims, reducible)  
\#   text-embedding-3-large : higher quality for hard retrieval (3072 dims)  
\# Open-source (self-host, free): all-MiniLM-L6-v2 (384d, fast), bge-large / e5-large (strong).  
\# Check the MTEB leaderboard, your language/domain, latency budget, and storage cost.

**Test / Demo & Expected Output (Python-runnable)**

\# Embedding model selection — trade off dimensions, cost, speed, and quality  
models \= \[  
    {"name": "small-fast",  "dim": 384,  "cost\_per\_1k": 0.00002, "quality": 0.82, "latency\_ms": 8},  
    {"name": "base",        "dim": 768,  "cost\_per\_1k": 0.00005, "quality": 0.88, "latency\_ms": 15},  
    {"name": "large-best",  "dim": 1536, "cost\_per\_1k": 0.00013, "quality": 0.93, "latency\_ms": 32},  
\]  
   
def pick(models, priority):  
    \# Choose by the dimension that matters most for the use case.  
    key \= {"quality": lambda m: m\["quality"\],  
           "cost": lambda m: \-m\["cost\_per\_1k"\],  
           "speed": lambda m: \-m\["latency\_ms"\]}\[priority\]  
    return max(models, key=key)  
   
for p in ("quality", "cost", "speed"):  
    print(f"Priority={p:8} \-\> {pick(models, p)\['name'\]}")  
assert pick(models, "quality")\["name"\] \== "large-best"  
assert pick(models, "cost")\["name"\] \== "small-fast"  
assert pick(models, "speed")\["name"\] \== "small-fast"  
print("Pick an embedding model by your priority: quality vs cost vs speed vs dimension size.")  
print("Higher dimensions usually mean better quality but more storage, cost, and latency.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Priority=quality  \-\> large-best  
\# Priority=cost     \-\> small-fast  
\# Priority=speed    \-\> small-fast  
\# Pick an embedding model by your priority: quality vs cost vs speed vs dimension size.  
\# Higher dimensions usually mean better quality but more storage, cost, and latency.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What factors drive embedding model choice?**

A: Retrieval quality (e.g., MTEB scores), vector dimensions (storage/speed), cost (hosted per-token vs self-hosted infra), latency, and language/domain coverage.

**Q: Why do dimensions matter?**

A: More dimensions can capture more nuance but cost more to store and slow down similarity search. Smaller vectors are cheaper and faster, often with acceptable quality.

**Q: What happens if you change embedding models later?**

A: All stored vectors must be regenerated, because vectors from different models aren't comparable. Plan for that re-embedding cost before switching.

## **28\. Cosine similarity**

**Simple Explanation**

Cosine similarity measures how aligned two vectors are by the cosine of the angle between them. It ranges from 1 (same direction, most similar) through 0 (orthogonal, unrelated) to \-1 (opposite). Crucially, it ignores magnitude — only direction matters — which makes it ideal for comparing text embeddings regardless of text length.

It's the standard metric for embedding similarity in semantic search and RAG. Computationally, for L2-normalized vectors cosine similarity equals the dot product, which is why vector databases often store normalized vectors and use fast inner-product search to find nearest neighbors.

**Hinglish Explanation**

Cosine similarity maapti hai ki do vectors kitne aligned hain, unke beech ke angle ke cosine se. Ye 1 (same direction, sabse similar) se 0 (orthogonal, unrelated) hote hue \-1 (opposite) tak hoti hai. Khaas baat: ye magnitude ignore karti hai — sirf direction matter karti hai — jo use text embeddings compare karne ke liye ideal banata hai chahe text length kuch bhi ho.

Ye semantic search aur RAG mein embedding similarity ka standard metric hai. Computationally, L2-normalized vectors ke liye cosine similarity dot product ke barabar hoti hai, isiliye vector databases aksar normalized vectors store karke fast inner-product search use karte hain nearest neighbors dhoondhne ke liye.

**Key Interview Points**

* Cosine of the angle between vectors: 1 \= same, 0 \= unrelated, \-1 \= opposite.

* Ignores magnitude — compares direction/meaning, not length.

* The standard metric for embedding similarity in search/RAG.

* For normalized vectors, cosine similarity \== dot product.

* Vector DBs exploit this with fast inner-product search.

**Real-World Example**

A semantic search ranks documents by cosine similarity to the query embedding. A short FAQ entry and a long article on the same topic both score highly because cosine ignores length and focuses on directional meaning.

**Code — Full & Runnable (Python)**

*Real NumPy cosine-similarity code. The Python-runnable demo below computes it for identical, scaled, orthogonal, and opposite vectors so the metric's behavior is verifiable here.*

\# Cosine similarity — the standard metric for comparing embeddings.  
import numpy as np  
   
def cosine\_similarity(a, b) \-\> float:  
    a, b \= np.array(a), np.array(b)  
    return float(a @ b / (np.linalg.norm(a) \* np.linalg.norm(b)))  
   
\# If vectors are already L2-normalized, cosine similarity is just the dot product:  
def cosine\_normalized(a, b) \-\> float:  
    return float(np.dot(a, b))  
   
\# Cosine measures the angle between vectors (direction), ignoring magnitude:  
\#   1.0  \= same meaning/direction  
\#   0.0  \= unrelated (orthogonal)  
\#  \-1.0  \= opposite  
\# Vector DBs let you pick the metric (cosine, dot product, or Euclidean/L2).

**Test / Demo & Expected Output (Python-runnable)**

\# Cosine similarity — measure similarity by the angle between vectors (ignores magnitude)  
import math  
def cosine(a, b):  
    dot \= sum(x \* y for x, y in zip(a, b))  
    na \= math.sqrt(sum(x \* x for x in a)); nb \= math.sqrt(sum(y \* y for y in b))  
    return dot / (na \* nb)  
   
same      \= cosine(\[1, 2, 3\], \[1, 2, 3\])      \# identical direction \-\> 1.0  
scaled    \= cosine(\[1, 2, 3\], \[2, 4, 6\])      \# same direction, different magnitude \-\> 1.0  
orthog    \= cosine(\[1, 0\], \[0, 1\])            \# perpendicular \-\> 0.0  
opposite  \= cosine(\[1, 0\], \[-1, 0\])           \# opposite \-\> \-1.0  
print(f"identical:   {same:.2f}")  
print(f"scaled (2x): {scaled:.2f}  (magnitude ignored)")  
print(f"orthogonal:  {orthog:.2f}")  
print(f"opposite:    {opposite:.2f}")  
assert abs(same \- 1.0) \< 1e-9 and abs(scaled \- 1.0) \< 1e-9  
assert abs(orthog) \< 1e-9 and abs(opposite \+ 1.0) \< 1e-9  
print("Cosine similarity \= cos(angle): 1 \= same direction, 0 \= unrelated, \-1 \= opposite.")  
print("It compares meaning/direction regardless of vector length \\u2014 the standard for embeddings.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# identical:   1.00  
\# scaled (2x): 1.00  (magnitude ignored)  
\# orthogonal:  0.00  
\# opposite:    \-1.00  
\# Cosine similarity \= cos(angle): 1 \= same direction, 0 \= unrelated, \-1 \= opposite.  
\# It compares meaning/direction regardless of vector length — the standard for embeddings.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why use cosine similarity instead of Euclidean distance?**

A: Cosine focuses on direction (meaning) and ignores magnitude, so texts of different lengths compare fairly. Euclidean distance is sensitive to vector magnitude, which can distort text-embedding comparisons.

**Q: What does a cosine similarity of 0 mean?**

A: The vectors are orthogonal — essentially unrelated in meaning. Values near 1 mean very similar; negative values mean opposing direction.

**Q: How does normalization relate to cosine similarity?**

A: If vectors are L2-normalized, cosine similarity equals their dot product. Vector DBs store normalized vectors so they can use fast inner-product search as an exact cosine ranking.

## **29\. Similarity search**

**Simple Explanation**

Similarity search (nearest-neighbor search) finds the stored vectors closest to a query vector — typically the top-k by cosine similarity. It's the core operation of a vector database: given an embedded query, return the most semantically similar items.

Exact search scans every vector and is fine for small collections, but it scales linearly and becomes slow with millions of vectors. Production systems use Approximate Nearest Neighbor (ANN) indexes such as HNSW or IVF, which trade a tiny amount of accuracy for dramatically faster, sub-linear search.

**Hinglish Explanation**

Similarity search (nearest-neighbor search) un stored vectors ko dhoondhti hai jo ek query vector ke sabse paas hon — aksar cosine similarity se top-k. Ye ek vector database ka core operation hai: ek embedded query do, sabse semantically similar items wapas do.

Exact search har vector scan karti hai aur chhoti collections ke liye theek hai, par ye linearly scale karti hai aur millions vectors ke saath slow ho jaati hai. Production systems Approximate Nearest Neighbor (ANN) indexes use karte hain jaise HNSW ya IVF, jo thodi si accuracy ke badle bahut zyada fast, sub-linear search dete hain.

**Key Interview Points**

* Finds the top-k stored vectors closest to a query (by cosine).

* The core operation of a vector database.

* Exact search scans all vectors — simple but linear (slow at scale).

* Production uses ANN indexes (HNSW, IVF) for sub-linear speed.

* ANN trades a little accuracy for big speed gains.

**Real-World Example**

A product-recommendation feature embeds the item a user is viewing and runs a similarity search over millions of product vectors via an HNSW index — returning the most similar products in milliseconds, which exact search couldn't do at that scale.

**Code — Full & Runnable (Python)**

*Real NumPy vector-store code. The Python-runnable demo below ranks stored vectors by cosine and returns the top-k, so k-NN retrieval is verifiable here.*

\# Similarity search — find the top-k nearest vectors (here with FAISS for speed).  
import numpy as np  
import faiss  
   
dim \= 1536  
index \= faiss.IndexFlatIP(dim)              \# inner-product index (cosine if normalized)  
   
\# Suppose you've embedded your documents into \`doc\_vectors\` (n x dim, float32, normalized).  
\# faiss.normalize\_L2(doc\_vectors)  
\# index.add(doc\_vectors)  
   
def search(query\_vector, k=5):  
    q \= np.array(\[query\_vector\], dtype="float32")  
    faiss.normalize\_L2(q)  
    scores, ids \= index.search(q, k)        \# returns top-k scores and their row ids  
    return list(zip(ids\[0\].tolist(), scores\[0\].tolist()))  
   
\# Exact search (IndexFlat) is O(n). For millions of vectors use ANN indexes  
\# (IndexIVFFlat, IndexHNSWFlat) that trade a little recall for huge speedups.

**Test / Demo & Expected Output (Python-runnable)**

\# Similarity search — find the k nearest vectors to a query (brute-force k-NN)  
import math  
def cosine(a, b):  
    dot \= sum(x\*y for x, y in zip(a, b))  
    na \= math.sqrt(sum(x\*x for x in a)); nb \= math.sqrt(sum(y\*y for y in b))  
    return dot / (na \* nb) if na and nb else 0.0  
   
\# A tiny "index": id \-\> vector  
index \= {  
    "doc1": \[0.9, 0.1, 0.0\],  
    "doc2": \[0.8, 0.2, 0.1\],  
    "doc3": \[0.1, 0.9, 0.0\],  
    "doc4": \[0.0, 0.1, 0.9\],  
}  
def search(query, k=2):  
    scored \= \[(doc\_id, cosine(query, vec)) for doc\_id, vec in index.items()\]  
    scored.sort(key=lambda x: x\[1\], reverse=True)  
    return scored\[:k\]  
   
query \= \[0.85, 0.15, 0.0\]  
results \= search(query, k=2)  
for doc\_id, score in results:  
    print(f"{doc\_id}: {score:.3f}")  
assert results\[0\]\[0\] in ("doc1", "doc2"), "nearest neighbors are the similar docs"  
assert results\[0\]\[1\] \>= results\[1\]\[1\], "results sorted by similarity descending"  
print("Similarity search returns the top-k vectors closest to the query vector.")  
print("Brute force is O(n); real vector DBs use ANN indexes (HNSW, IVF) to scale to millions.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# doc1: 0.998  
\# doc2: 0.990  
\# Similarity search returns the top-k vectors closest to the query vector.  
\# Brute force is O(n); real vector DBs use ANN indexes (HNSW, IVF) to scale to millions.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What is k in similarity search?**

A: The number of nearest neighbors to return — the top-k most similar vectors to the query. In RAG, k controls how many chunks you retrieve for context.

**Q: Why use approximate (ANN) search?**

A: Exact nearest-neighbor search is linear in the number of vectors, which is too slow at scale. ANN indexes (HNSW, IVF) give sub-linear search with only a small accuracy trade-off.

**Q: How does similarity search relate to embeddings?**

A: Embeddings place meaning in a vector space; similarity search finds the nearest vectors in that space, returning the most semantically related items to a query.

## **30\. Semantic search**

**Simple Explanation**

Semantic search retrieves results by meaning rather than exact keyword matching. Both the documents and the query are converted to embeddings, and results are ranked by vector similarity — so a query can match a document even when they share no words, as long as they're about the same thing.

This overcomes the core weakness of traditional keyword search, which misses synonyms and paraphrases ('can't log in' vs 'authentication error'). Semantic search powers modern search bars, FAQ matching, and the retrieval step of RAG. For queries needing exact terms (codes, names) it's often combined with keyword search as hybrid search.

**Hinglish Explanation**

Semantic search results ko meaning se retrieve karti hai, exact keyword matching ke bajaye. Documents aur query dono embeddings mein convert hote hain, aur results vector similarity se rank hote hain — to ek query ek document se match kar sakti hai chahe unmein koi word share na ho, jab tak wo ek hi cheez ke baare mein hon.

Ye traditional keyword search ki core weakness ko door karti hai, jo synonyms aur paraphrases miss karti hai ('can't log in' vs 'authentication error'). Semantic search modern search bars, FAQ matching, aur RAG ke retrieval step ko power karti hai. Exact terms (codes, names) waali queries ke liye ise aksar keyword search ke saath hybrid search ke roop mein combine kiya jaata hai.

**Key Interview Points**

* Retrieves by meaning, not exact keywords.

* Embeds both documents and query; ranks by vector similarity.

* Matches synonyms/paraphrases keyword search would miss.

* Powers smart search bars, FAQ matching, and RAG retrieval.

* Often combined with keyword search (hybrid) for exact-term queries.

**Real-World Example**

A help center's semantic search returns the 'authentication issues' article when a user types 'I can't sign in' — no shared keywords, but the same meaning. Keyword search would have returned nothing useful for that phrasing.

**Code — Full & Runnable (Python)**

*Real OpenAI \+ NumPy semantic-search code (needs an API key). The Python-runnable demo below matches a query to docs with no shared keywords, so meaning-based retrieval is verifiable here.*

\# Semantic search — embed the query the same way as docs, then retrieve by similarity.  
from openai import OpenAI  
import numpy as np  
client \= OpenAI()  
   
EMBED\_MODEL \= "text-embedding-3-small"  
   
def embed(texts):  
    return \[d.embedding for d in client.embeddings.create(model=EMBED\_MODEL, input=texts).data\]  
   
class SemanticIndex:  
    def \_\_init\_\_(self, documents):  
        self.documents \= documents  
        self.vectors \= np.array(embed(documents))     \# embed once at build time  
    def search(self, query, k=3):  
        qv \= np.array(embed(\[query\])\[0\])  
        sims \= self.vectors @ qv / (np.linalg.norm(self.vectors, axis=1) \* np.linalg.norm(qv))  
        top \= np.argsort(sims)\[::-1\]\[:k\]  
        return \[(self.documents\[i\], float(sims\[i\])) for i in top\]  
   
\# Semantic search finds results by MEANING, so "can't sign in" matches an article on  
\# "authentication errors" even with no shared keywords \\u2014 the key advantage over keyword search.

**Test / Demo & Expected Output (Python-runnable)**

\# Semantic search — match by meaning, not keywords (embeddings make this possible)  
import math  
\# Toy concept vectors: dims \~ \[auth, payment, speed\]  
docs \= {  
    "How to reset your password":        \[0.9, 0.0, 0.1\],  
    "Login and authentication issues":   \[0.95, 0.0, 0.0\],  
    "Refund and billing questions":      \[0.0, 0.95, 0.0\],  
    "Why is the app slow?":              \[0.0, 0.0, 0.95\],  
}  
def embed\_query(q):  
    q \= q.lower()  
    return \[  
        1.0 if any(w in q for w in ("log in", "login", "sign in", "password", "account")) else 0.0,  
        1.0 if any(w in q for w in ("refund", "charge", "billing", "pay")) else 0.0,  
        1.0 if any(w in q for w in ("slow", "lag", "fast", "speed")) else 0.0,  
    \]  
def cosine(a, b):  
    d \= sum(x\*y for x, y in zip(a, b)); na=math.sqrt(sum(x\*x for x in a)); nb=math.sqrt(sum(y\*y for y in b))  
    return d/(na\*nb) if na and nb else 0.0  
   
\# Keyword search would FAIL here: "can't sign in" shares no words with the doc titles.  
query \= "I can't sign in to my account"  
qv \= embed\_query(query)  
best \= max(docs.items(), key=lambda kv: cosine(qv, kv\[1\]))  
print(f"Query: {query\!r}")  
print(f"Best match (by meaning): {best\[0\]\!r}")  
assert best\[0\] \== "Login and authentication issues"  
print("Semantic search matches intent/meaning via embeddings, not exact keyword overlap.")  
print("So 'can't sign in' finds 'authentication issues' even with zero shared words.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Query: "I can't sign in to my account"  
\# Best match (by meaning): 'Login and authentication issues'  
\# Semantic search matches intent/meaning via embeddings, not exact keyword overlap.  
\# So 'can't sign in' finds 'authentication issues' even with zero shared words.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: How is semantic search different from keyword search?**

A: Keyword search matches exact terms; semantic search matches meaning via embeddings, so it finds relevant results even when wording differs (synonyms, paraphrases).

**Q: When might keyword search still be better?**

A: For exact matches — product codes, names, IDs, rare tokens — where literal term matching is precise. That's why hybrid search combines both approaches.

**Q: How does semantic search relate to RAG?**

A: Semantic search is the retrieval step of RAG: it finds the most meaning-relevant chunks to inject as context for the LLM's grounded answer.

## **31\. Pinecone basics**

**Simple Explanation**

Pinecone is a fully-managed, cloud vector database. You create an index sized to your embedding dimensions, upsert vectors (each with an id and optional metadata), and query with a vector to get the top-k most similar items. It handles the ANN indexing, scaling, persistence, and availability so you run zero infrastructure.

Key features include metadata filtering (restrict results by fields like topic or date), namespaces (isolate data within an index, e.g., per tenant), and hybrid search. Because it's managed and scales to billions of vectors, Pinecone is a popular choice for production RAG when you don't want to operate a vector store yourself.

**Hinglish Explanation**

Pinecone ek fully-managed, cloud vector database hai. Aap apne embedding dimensions ke hisaab se ek index banate ho, vectors upsert karte ho (har ek id aur optional metadata ke saath), aur ek vector se query karke top-k sabse similar items lete ho. Ye ANN indexing, scaling, persistence aur availability handle karta hai taaki aap zero infrastructure chalao.

Key features: metadata filtering (results ko topic ya date jaise fields se restrict karna), namespaces (index ke andar data isolate karna, jaise per tenant), aur hybrid search. Kyunki ye managed hai aur billions vectors tak scale karta hai, Pinecone production RAG ke liye popular choice hai jab aap khud vector store operate nahi karna chahte.

**Key Interview Points**

* Fully-managed cloud vector DB — zero infrastructure to run.

* Create an index, upsert (id, vector, metadata), query top-k.

* Metadata filtering restricts results by fields (topic, date, ...).

* Namespaces isolate data within an index (e.g., per tenant).

* Scales to billions of vectors with managed ANN indexing.

**Real-World Example**

A SaaS product gives each customer their own namespace in a Pinecone index, upserts their document embeddings with metadata, and queries with metadata filters so search results never leak across tenants — all without the team running any database servers.

**Code — Full & Runnable (Python)**

*Real Pinecone \+ OpenAI code (needs API keys). The Python-runnable demo below simulates upsert, top-k query, and metadata filtering so the API model is verifiable here.*

\# Pinecone basics — managed, serverless vector database.  
from pinecone import Pinecone, ServerlessSpec  
from openai import OpenAI  
   
pc \= Pinecone(api\_key="YOUR\_PINECONE\_KEY")  
client \= OpenAI()  
   
\# Create an index (once): name, vector dimension, and similarity metric.  
if "docs" not in \[i.name for i in pc.list\_indexes()\]:  
    pc.create\_index(name="docs", dimension=1536, metric="cosine",  
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"))  
index \= pc.Index("docs")  
   
def embed(text):  
    return client.embeddings.create(model="text-embedding-3-small", input=text).data\[0\].embedding  
   
\# Upsert vectors with ids and metadata.  
index.upsert(vectors=\[  
    {"id": "doc1", "values": embed("Returns within 30 days."), "metadata": {"topic": "returns"}},  
    {"id": "doc2", "values": embed("Free shipping over $50."), "metadata": {"topic": "shipping"}},  
\])  
   
\# Query top-k, optionally filtering on metadata.  
res \= index.query(vector=embed("return policy"), top\_k=2,  
                  filter={"topic": "returns"}, include\_metadata=True)

**Test / Demo & Expected Output (Python-runnable)**

\# Pinecone basics — a managed vector DB: upsert vectors with metadata, then query top-k  
import math  
def cosine(a, b):  
    d=sum(x\*y for x,y in zip(a,b)); na=math.sqrt(sum(x\*x for x in a)); nb=math.sqrt(sum(y\*y for y in b))  
    return d/(na\*nb) if na and nb else 0.0  
   
class FakePineconeIndex:  
    def \_\_init\_\_(self): self.store \= {}  
    def upsert(self, vectors):  
        for vid, vec, meta in vectors:  
            self.store\[vid\] \= {"values": vec, "metadata": meta}  
    def query(self, vector, top\_k=2, filter=None):  
        items \= self.store.items()  
        if filter:  \# metadata filtering, like Pinecone supports  
            items \= \[(i, d) for i, d in items if all(d\["metadata"\].get(k) \== v for k, v in filter.items())\]  
        scored \= \[{"id": i, "score": round(cosine(vector, d\["values"\]), 3), "metadata": d\["metadata"\]}  
                  for i, d in items\]  
        scored.sort(key=lambda x: x\["score"\], reverse=True)  
        return {"matches": scored\[:top\_k\]}  
   
idx \= FakePineconeIndex()  
idx.upsert(\[  
    ("a", \[0.9, 0.1\], {"topic": "ml"}),  
    ("b", \[0.8, 0.2\], {"topic": "ml"}),  
    ("c", \[0.1, 0.9\], {"topic": "cooking"}),  
\])  
res \= idx.query(\[0.85, 0.15\], top\_k=2, filter={"topic": "ml"})  
for m in res\["matches"\]:  
    print(m\["id"\], m\["score"\], m\["metadata"\])  
assert all(m\["metadata"\]\["topic"\] \== "ml" for m in res\["matches"\]), "metadata filter applied"  
assert res\["matches"\]\[0\]\["id"\] in ("a", "b")  
print("Pinecone: managed, serverless vector DB. Core ops: upsert(id, vector, metadata) and query(top\_k).")  
print("Supports metadata filtering, namespaces, and scales to billions of vectors with ANN indexes.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# a 0.998 {'topic': 'ml'}  
\# b 0.998 {'topic': 'ml'}  
\# Pinecone: managed, serverless vector DB. Core ops: upsert(id, vector, metadata) and query(top\_k).  
\# Supports metadata filtering, namespaces, and scales to billions of vectors with ANN indexes.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What is Pinecone and when would you use it?**

A: A managed cloud vector database. Use it for production RAG/semantic search when you want scalable similarity search without operating your own vector store or ANN infrastructure.

**Q: What are namespaces used for?**

A: Partitioning data within an index — for example, isolating each tenant's vectors — so queries can be scoped and data stays separated within the same index.

**Q: How does metadata filtering help?**

A: It restricts similarity search to vectors matching given fields (e.g., topic='returns', lang='en'), combining semantic relevance with precise structured constraints.

## **32\. ChromaDB basics**

**Simple Explanation**

ChromaDB is a lightweight, open-source vector database designed for ease of use, especially in local development and small-to-medium RAG apps. It can run in-memory or persist to disk, and it can embed your documents for you via a configurable embedding function — so you often just add raw text and query with raw text.

You organize data into collections, call add() with ids/documents/metadata (Chroma embeds them automatically), and call query() to retrieve the most similar documents, optionally with metadata filters. Its simplicity makes it a favorite for prototyping RAG before scaling up to a managed service if needed.

**Hinglish Explanation**

ChromaDB ek lightweight, open-source vector database hai jo ease of use ke liye banaya gaya hai, khaaskar local development aur small-to-medium RAG apps mein. Ye in-memory chal sakta hai ya disk par persist kar sakta hai, aur ye aapke documents ko ek configurable embedding function se khud embed kar sakta hai — to aap aksar bas raw text add karte ho aur raw text se query karte ho.

Aap data ko collections mein organize karte ho, add() call karte ho ids/documents/metadata ke saath (Chroma unhe automatically embed karta hai), aur query() call karke sabse similar documents retrieve karte ho, optionally metadata filters ke saath. Iski simplicity ise RAG prototyping ke liye favorite banati hai, zaroorat par managed service tak scale karne se pehle.

**Key Interview Points**

* Lightweight, open-source vector DB; runs locally or persists to disk.

* Can embed documents for you via an embedding function.

* Organize data into collections; add() ids/documents/metadata.

* query() returns similar documents, with optional metadata filters.

* Ideal for prototyping and small/medium RAG apps.

**Real-World Example**

A developer prototyping a docs chatbot uses ChromaDB locally: they add() the chunked documentation (Chroma auto-embeds it) and query() with user questions — a working RAG retriever running on their laptop with no external services.

**Code — Full & Runnable (Python)**

*Real ChromaDB code with an OpenAI embedding function. The Python-runnable demo below simulates add()/query() with metadata filtering so the workflow is verifiable here.*

\# ChromaDB basics — open-source, local-first vector store (great for prototyping).  
import chromadb  
   
client \= chromadb.Client()                     \# in-memory; use PersistentClient(path=...) to save  
collection \= client.create\_collection("docs")  \# Chroma can embed documents for you by default  
   
\# Add documents (Chroma computes embeddings under the hood).  
collection.add(  
    ids=\["1", "2", "3"\],  
    documents=\["Python is a programming language",  
               "Pasta recipe with tomato sauce",  
               "JavaScript is a programming language"\],  
    metadatas=\[{"cat": "tech"}, {"cat": "food"}, {"cat": "tech"}\],  
)  
   
\# Query by natural-language text; optionally filter by metadata.  
results \= collection.query(  
    query\_texts=\["tell me about a programming language"\],  
    n\_results=2,  
    where={"cat": "tech"},  
)  
\# results\["documents"\] \-\> the most similar documents

**Test / Demo & Expected Output (Python-runnable)**

\# ChromaDB basics — an open-source, local-first vector store with collections  
import hashlib, math  
def embed(text, dim=16):  
    v=\[0.0\]\*dim  
    for w in text.lower().split():  
        v\[int(hashlib.md5(w.encode()).hexdigest(),16)%dim\]+=1.0  
    n=math.sqrt(sum(x\*x for x in v)) or 1.0  
    return \[x/n for x in v\]  
def cosine(a,b):  
    d=sum(x\*y for x,y in zip(a,b)); na=math.sqrt(sum(x\*x for x in a)); nb=math.sqrt(sum(y\*y for y in b))  
    return d/(na\*nb) if na and nb else 0.0  
   
class FakeChromaCollection:  
    def \_\_init\_\_(self): self.docs=\[\]  
    def add(self, ids, documents, metadatas=None):  
        metadatas \= metadatas or \[{}\]\*len(ids)  
        for i, doc, m in zip(ids, documents, metadatas):  
            self.docs.append({"id": i, "document": doc, "embedding": embed(doc), "metadata": m})  
    def query(self, query\_texts, n\_results=2):  
        qv \= embed(query\_texts\[0\])  
        ranked \= sorted(self.docs, key=lambda d: cosine(qv, d\["embedding"\]), reverse=True)\[:n\_results\]  
        return {"ids": \[\[d\["id"\] for d in ranked\]\], "documents": \[\[d\["document"\] for d in ranked\]\]}  
   
col \= FakeChromaCollection()  
col.add(ids=\["1","2","3"\],  
        documents=\["Python is a programming language",  
                   "Pasta recipe with tomato sauce",  
                   "JavaScript is a programming language"\],  
        metadatas=\[{"cat":"tech"},{"cat":"food"},{"cat":"tech"}\])  
res \= col.query(query\_texts=\["tell me about a programming language"\], n\_results=2)  
print("Top documents:", res\["documents"\]\[0\])  
assert all("programming language" in d for d in res\["documents"\]\[0\]), "retrieves the tech docs"  
print("ChromaDB: open-source, runs locally/in-process. Chroma embeds your documents for you.")  
print("Core API: create a collection, add(documents), then query(query\_texts) \\u2014 great for prototyping.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Top documents: \['Python is a programming language', 'JavaScript is a programming language'\]  
\# ChromaDB: open-source, runs locally/in-process. Chroma embeds your documents for you.  
\# Core API: create a collection, add(documents), then query(query\_texts) — great for prototyping.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What makes ChromaDB good for prototyping?**

A: It's simple and runs locally with minimal setup, can auto-embed documents, and persists to disk — you can build a working RAG retriever without provisioning any cloud infrastructure.

**Q: Does Chroma require you to generate embeddings yourself?**

A: Not necessarily — you can configure an embedding function so add()/query() embed text automatically, or you can supply your own precomputed vectors.

**Q: When would you move off Chroma?**

A: When you need large-scale, highly concurrent, or fully-managed production serving — then a service like Pinecone or a scalable engine like Qdrant/Weaviate may fit better.

## **33\. FAISS basics**

**Simple Explanation**

FAISS (Facebook AI Similarity Search) is a high-performance library for similarity search over dense vectors. It's not a server — it's an in-process library you embed in your app, and you manage storage/persistence yourself. It powers the search inside many higher-level vector stores.

FAISS offers exact indexes (IndexFlat, brute-force — perfect accuracy) and approximate indexes (IVF, HNSW, PQ) that cluster or compress vectors for much faster, memory-efficient search at scale, with a small accuracy trade-off. Normalizing vectors lets you use inner-product search as cosine similarity. It's a go-to when you want speed and control without running a separate database.

**Hinglish Explanation**

FAISS (Facebook AI Similarity Search) dense vectors par similarity search ke liye ek high-performance library hai. Ye server nahi hai — ye ek in-process library hai jo aap apne app mein embed karte ho, aur storage/persistence aap khud manage karte ho. Ye kai higher-level vector stores ke andar ki search ko power karta hai.

FAISS exact indexes (IndexFlat, brute-force — perfect accuracy) aur approximate indexes (IVF, HNSW, PQ) deta hai jo vectors ko cluster ya compress karke scale par bahut faster, memory-efficient search dete hain, thodi si accuracy ke trade-off ke saath. Vectors normalize karne se aap inner-product search ko cosine similarity ki tarah use kar sakte ho. Ye tab go-to hai jab aap speed aur control chahte ho bina alag database chalaye.

**Key Interview Points**

* High-performance similarity-search library (in-process, not a server).

* You manage storage/persistence; it powers many vector stores.

* Exact (IndexFlat) \= perfect accuracy, brute force.

* Approximate (IVF, HNSW, PQ) \= fast, memory-efficient at scale.

* Normalize vectors to use inner-product search as cosine similarity.

**Real-World Example**

An ML team builds an in-app semantic search over a few million embeddings using a FAISS HNSW index loaded into memory — getting millisecond queries with full control and no external database, persisting the index to disk between runs.

**Code — Full & Runnable (Python)**

*Real FAISS code (Facebook AI Similarity Search). The Python-runnable demo below implements an exact inner-product index so the search behavior is verifiable here.*

\# FAISS basics — a fast in-memory similarity-search library (you host it yourself).  
import numpy as np  
import faiss  
   
dim \= 128  
\# Exact search:  
index \= faiss.IndexFlatL2(dim)                 \# L2 distance; IndexFlatIP for inner product  
   
vectors \= np.random.random((1000, dim)).astype("float32")  
index.add(vectors)                             \# add all document vectors  
print("Indexed vectors:", index.ntotal)  
   
query \= np.random.random((1, dim)).astype("float32")  
distances, ids \= index.search(query, k=5)      \# top-5 nearest neighbors  
   
\# For large datasets, use approximate indexes for speed:  
\# quantizer \= faiss.IndexFlatL2(dim)  
\# index \= faiss.IndexIVFFlat(quantizer, dim, 100\)  \# IVF; or faiss.IndexHNSWFlat(dim, 32\)  
\# index.train(vectors); index.add(vectors)  
\# Save/load: faiss.write\_index(index, "my.index"); faiss.read\_index("my.index")

**Test / Demo & Expected Output (Python-runnable)**

\# FAISS basics — a high-performance similarity-search library (in-memory ANN index)  
import math  
def l2(a, b): return math.sqrt(sum((x-y)\*\*2 for x, y in zip(a, b)))  
   
class FakeFaissFlatIndex:  
    \# Mimics IndexFlatL2: stores vectors, searches by exact L2 distance.  
    def \_\_init\_\_(self, dim): self.dim=dim; self.vectors=\[\]  
    def add(self, vectors): self.vectors.extend(vectors)   \# add many vectors at once  
    def search(self, query, k):  
        dists \= sorted(((l2(query, v), i) for i, v in enumerate(self.vectors)))  
        D \= \[d for d, \_ in dists\[:k\]\]; I \= \[i for \_, i in dists\[:k\]\]  
        return D, I    \# distances and integer ids (FAISS returns numpy arrays)  
   
index \= FakeFaissFlatIndex(dim=3)  
index.add(\[\[1,0,0\],\[0.9,0.1,0\],\[0,1,0\],\[0,0,1\]\])  
D, I \= index.search(\[0.95,0.05,0\], k=2)  
print("Nearest ids:", I)  
print("Distances:  ", \[round(d,3) for d in D\])  
assert I\[0\] in (0,1), "closest vectors found"  
assert D\[0\] \<= D\[1\], "results sorted by ascending distance"  
print("FAISS: a fast C++/Python library for vector search, not a managed service (you host it).")  
print("Use IndexFlat for exact search; IVF/HNSW for approximate search at large scale.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Nearest ids: \[1, 0\]  
\# Distances:   \[0.071, 0.071\]  
\# FAISS: a fast C++/Python library for vector search, not a managed service (you host it).  
\# Use IndexFlat for exact search; IVF/HNSW for approximate search at large scale.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Is FAISS a database?**

A: No — it's a library for fast vector search that runs in your process. You handle persistence and serving yourself, unlike a managed vector DB. It often serves as the search engine inside other tools.

**Q: Exact vs approximate FAISS indexes?**

A: Flat indexes do exact brute-force search (perfect accuracy, slower at scale). IVF/HNSW/PQ are approximate — they cluster or compress vectors for much faster, lower-memory search with a small accuracy cost.

**Q: How do you get cosine similarity with FAISS?**

A: Normalize your vectors (L2) and use an inner-product index (IndexFlatIP). For normalized vectors, inner product equals cosine similarity.

## **34\. Vector DB alternatives (pgvector / Qdrant / Weaviate)**

**Simple Explanation**

Beyond Pinecone, several vector databases suit different needs. pgvector is a PostgreSQL extension — ideal if you already run Postgres, letting you keep vectors alongside relational data and filter with SQL. Qdrant is a high-performance, open-source vector DB with rich payload filtering and strong scaling, available self-hosted or cloud.

Weaviate is an open-source vector DB notable for built-in vectorization modules and first-class hybrid (keyword \+ vector) search. All of them store vectors and perform ANN search; the choice comes down to your existing stack, hosting preference (self-hosted vs managed), filtering needs, hybrid-search support, and operational appetite.

**Hinglish Explanation**

Pinecone ke alawa, kai vector databases alag needs ke liye suit karte hain. pgvector ek PostgreSQL extension hai — ideal agar aap pehle se Postgres chalate ho, vectors ko relational data ke saath rakhne aur SQL se filter karne dekar. Qdrant ek high-performance, open-source vector DB hai jisme rich payload filtering aur strong scaling hai, self-hosted ya cloud available.

Weaviate ek open-source vector DB hai jo built-in vectorization modules aur first-class hybrid (keyword \+ vector) search ke liye notable hai. Ye sab vectors store karte hain aur ANN search karte hain; choice aapke existing stack, hosting preference (self-hosted vs managed), filtering needs, hybrid-search support, aur operational appetite par depend karti hai.

**Key Interview Points**

* pgvector: a Postgres extension — reuse your DB; filter with SQL.

* Qdrant: high-performance, open-source; rich payload filtering.

* Weaviate: built-in vectorization \+ first-class hybrid search.

* All store vectors and do ANN search; differ in hosting/filtering/ops.

* Choose by existing stack, hosting, filtering, hybrid needs, and ops appetite.

**Real-World Example**

A team already running PostgreSQL adds pgvector to store embeddings next to their existing tables — querying with familiar SQL and joining vector results to relational data — avoiding the operational overhead of standing up a separate vector database.

**Code — Full & Runnable (Python)**

*Real pgvector SQL, Qdrant, and Weaviate code. The Python-runnable demo below picks a database from requirements so the selection trade-offs are verifiable here.*

\# Vector DB alternatives — pgvector, Qdrant, Weaviate (same role, different trade-offs).  
   
\# 1\) pgvector \\u2014 add vectors to Postgres you already run (SQL \+ vectors together):  
\#    CREATE EXTENSION vector;  
\#    CREATE TABLE docs (id serial PRIMARY KEY, content text, embedding vector(1536));  
\#    SELECT content FROM docs ORDER BY embedding \<=\> '\[...\]' LIMIT 5;   \-- \<=\> \= cosine distance  
   
\# 2\) Qdrant \\u2014 dedicated vector DB with rich payload filtering:  
from qdrant\_client import QdrantClient  
from qdrant\_client.models import VectorParams, Distance, PointStruct  
qc \= QdrantClient(":memory:")  
qc.create\_collection("docs", vectors\_config=VectorParams(size=1536, distance=Distance.COSINE))  
\# qc.upsert("docs", points=\[PointStruct(id=1, vector=vec, payload={"topic": "returns"})\])  
\# qc.search("docs", query\_vector=qv, limit=5, query\_filter=...)  
   
\# 3\) Weaviate \\u2014 dedicated DB with built-in vectorizer modules and hybrid search:  
\# import weaviate  
\# client \= weaviate.connect\_to\_local()  
\# collection.query.hybrid(query="return policy", alpha=0.5, limit=5)  \# keyword \+ vector  
   
\# Choose by: ops model (managed vs self-host), existing stack (Postgres \-\> pgvector),  
\# filtering needs, hybrid-search support, scale, and cost.

**Test / Demo & Expected Output (Python-runnable)**

\# Vector DB alternatives — pgvector, Qdrant, Weaviate: same idea, different trade-offs  
options \= {  
    "pgvector":  {"type": "Postgres extension", "best\_for": "already on Postgres; SQL \+ vectors together"},  
    "Qdrant":    {"type": "dedicated vector DB", "best\_for": "rich filtering, Rust performance, self-host/cloud"},  
    "Weaviate":  {"type": "dedicated vector DB", "best\_for": "built-in vectorization modules \+ hybrid search"},  
    "Pinecone":  {"type": "managed service",     "best\_for": "fully managed, serverless scaling, no ops"},  
}  
def recommend(requirement):  
    table \= {  
        "already using postgres": "pgvector",  
        "no ops / fully managed": "Pinecone",  
        "advanced filtering self-hosted": "Qdrant",  
        "built-in hybrid search": "Weaviate",  
    }  
    return table\[requirement\]  
   
for k, v in options.items():  
    print(f"{k:9} | {v\['type'\]:20} | {v\['best\_for'\]}")  
assert recommend("already using postgres") \== "pgvector"  
assert recommend("no ops / fully managed") \== "Pinecone"  
print("\\nAll store vectors \+ metadata and do ANN search; pick by ops model, scale, filtering, and cost.")  
print("pgvector reuses Postgres; Qdrant/Weaviate are dedicated; Pinecone is fully managed.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# pgvector  | Postgres extension   | already on Postgres; SQL \+ vectors together  
\# Qdrant    | dedicated vector DB  | rich filtering, Rust performance, self-host/cloud  
\# Weaviate  | dedicated vector DB  | built-in vectorization modules \+ hybrid search  
\# Pinecone  | managed service      | fully managed, serverless scaling, no ops  
\#   
\# All store vectors \+ metadata and do ANN search; pick by ops model, scale, filtering, and cost.  
\# pgvector reuses Postgres; Qdrant/Weaviate are dedicated; Pinecone is fully managed.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: When is pgvector the right choice?**

A: When you already use PostgreSQL and want vectors alongside relational data with SQL filtering, avoiding a separate system. It's great for small-to-medium scale and simpler stacks.

**Q: What distinguishes Qdrant and Weaviate?**

A: Qdrant emphasizes performance and rich payload filtering. Weaviate offers built-in vectorization modules and strong hybrid (keyword+vector) search. Both are open-source and self-host or cloud.

**Q: How do you choose among vector databases?**

A: Weigh your existing stack, hosting preference (managed vs self-hosted), filtering/hybrid needs, scale, and how much ops you want to own. They share the same core (store vectors, ANN search).

## **35\. What is RAG**

**Simple Explanation**

RAG (Retrieval-Augmented Generation) is a pattern that grounds an LLM's answers in external knowledge. Instead of relying only on what the model learned during training, you retrieve relevant documents at query time, inject them into the prompt, and have the model generate an answer based on that retrieved context.

The three steps are Retrieve (find relevant chunks, usually by semantic search), Augment (add them to the prompt), and Generate (answer from the context). RAG lets LLMs use fresh, private, or domain-specific knowledge without retraining, and it sharply reduces hallucinations because answers are tied to real sources you can cite.

**Hinglish Explanation**

RAG (Retrieval-Augmented Generation) ek pattern hai jo ek LLM ke answers ko external knowledge mein ground karta hai. Sirf us par depend karne ke bajaye jo model ne training mein seekha, aap query time par relevant documents retrieve karte ho, unhe prompt mein inject karte ho, aur model se us retrieved context ke aadhaar par answer generate karwate ho.

Teen steps hain Retrieve (relevant chunks dhoondho, aksar semantic search se), Augment (unhe prompt mein add karo), aur Generate (context se answer do). RAG LLMs ko fresh, private, ya domain-specific knowledge use karne deta hai bina retraining ke, aur ye hallucinations ko sharply kam karta hai kyunki answers real sources se tied hote hain jinhe aap cite kar sakte ho.

**Key Interview Points**

* Grounds LLM answers in external knowledge retrieved at query time.

* Three steps: Retrieve \-\> Augment (the prompt) \-\> Generate.

* Adds fresh/private/domain knowledge without retraining the model.

* Sharply reduces hallucinations by tying answers to real sources.

* Sources can be cited, making answers verifiable.

**Real-World Example**

A company chatbot answers questions about internal HR policies by retrieving the relevant policy chunks from a vector store and feeding them to the LLM — giving accurate, up-to-date answers grounded in the actual documents, which the base model was never trained on.

**Code — Full & Runnable (Python)**

*Real OpenAI RAG code (needs an API key). The Python-runnable demo below runs a complete retrieve → augment → generate loop so the grounding behavior is verifiable here.*

\# What is RAG — Retrieval-Augmented Generation, end to end.  
from openai import OpenAI  
import numpy as np  
client \= OpenAI()  
   
def embed(texts):  
    return \[d.embedding for d in client.embeddings.create(model="text-embedding-3-small", input=texts).data\]  
   
\# Pre-index your knowledge base.  
KB \= \["Returns are accepted within 30 days.", "Free shipping over $50.", "Stores open 9-9 daily."\]  
KB\_VECS \= np.array(embed(KB))  
   
def rag(question, k=2):  
    \# 1\) RETRIEVE: find the most relevant chunks.  
    qv \= np.array(embed(\[question\])\[0\])  
    sims \= KB\_VECS @ qv / (np.linalg.norm(KB\_VECS, axis=1) \* np.linalg.norm(qv))  
    context \= "\\n".join(KB\[i\] for i in np.argsort(sims)\[::-1\]\[:k\])  
    \# 2\) AUGMENT: inject context into the prompt.  
    prompt \= f"Answer using ONLY this context:\\n{context}\\n\\nQuestion: {question}"  
    \# 3\) GENERATE: the LLM answers, grounded in your data.  
    return client.chat.completions.create(  
        model="gpt-4o-mini", temperature=0,  
        messages=\[{"role": "user", "content": prompt}\],  
    ).choices\[0\].message.content  
   
\# RAG grounds the model in your private/up-to-date data, cutting hallucinations.

**Test / Demo & Expected Output (Python-runnable)**

\# What is RAG — Retrieval-Augmented Generation: retrieve relevant context, then generate  
import math  
def cosine(a,b):  
    d=sum(x\*y for x,y in zip(a,b)); na=math.sqrt(sum(x\*x for x in a)); nb=math.sqrt(sum(y\*y for y in b))  
    return d/(na\*nb) if na and nb else 0.0  
   
\# Knowledge base: (text, toy embedding \[policy, hours, returns\])  
kb \= \[  
    ("Our return window is 30 days from purchase.", \[0,0,1\]),  
    ("Stores are open 9am to 9pm daily.",           \[0,1,0\]),  
    ("We offer free shipping over $50.",            \[1,0,0\]),  
\]  
def embed\_q(q):  
    q=q.lower()  
    return \[1.0 if "shipping" in q else 0.0,  
            1.0 if any(w in q for w in ("open","hours","time")) else 0.0,  
            1.0 if any(w in q for w in ("return","refund")) else 0.0\]  
   
def rag\_answer(question):  
    qv \= embed\_q(question)  
    best\_text, best\_score \= max(kb, key=lambda kv: cosine(qv, kv\[1\]))  
    \# 'Generate' grounded in the retrieved context (here: echo the fact).  
    return f"Based on our policy: {best\_text}"  
   
q \= "How many days do I have to return an item?"  
print("Q:", q)  
print("A:", rag\_answer(q))  
assert "30 days" in rag\_answer(q), "answer grounded in the retrieved document"  
print("RAG \= Retrieve relevant docs (via embeddings) \+ Augment the prompt \+ Generate the answer.")  
print("It grounds the LLM in YOUR data, reducing hallucinations and adding up-to-date knowledge.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Q: How many days do I have to return an item?  
\# A: Based on our policy: Our return window is 30 days from purchase.  
\# RAG \= Retrieve relevant docs (via embeddings) \+ Augment the prompt \+ Generate the answer.  
\# It grounds the LLM in YOUR data, reducing hallucinations and adding up-to-date knowledge.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What problem does RAG solve?**

A: It gives LLMs access to knowledge outside their training — fresh, private, or domain-specific — without retraining, and reduces hallucinations by grounding answers in retrieved, citable sources.

**Q: What are the three stages of RAG?**

A: Retrieve relevant chunks (usually via semantic search), Augment the prompt by injecting them as context, and Generate an answer based on that context.

**Q: How does RAG reduce hallucinations?**

A: By instructing the model to answer from the retrieved context (and ideally cite it), responses are tied to real documents rather than the model's unreliable internal recall.

## **36\. Document loaders & parsing**

**Simple Explanation**

Document loaders read source files — PDFs, HTML pages, CSVs, Word docs, Notion exports, and more — and parse them into a common Document structure of text plus metadata (source, page, type). This normalization is the first step of a RAG pipeline, letting all downstream stages stay format-agnostic.

Parsing quality matters a lot: messy extraction (garbled PDF text, lost tables, leftover markup) produces poor chunks, embeddings, and retrieval. Good loaders preserve clean text and useful metadata you can later filter on. The principle is 'garbage in, garbage out' — careful loading and parsing underpin everything that follows.

**Hinglish Explanation**

Document loaders source files padhte hain — PDFs, HTML pages, CSVs, Word docs, Notion exports, aur zyada — aur unhe ek common Document structure mein parse karte hain jo text plus metadata (source, page, type) hai. Ye normalization RAG pipeline ka pehla step hai, jo saare downstream stages ko format-agnostic rehne deta hai.

Parsing quality bahut matter karti hai: messy extraction (garbled PDF text, lost tables, leftover markup) kharab chunks, embeddings, aur retrieval produce karta hai. Achhe loaders clean text aur useful metadata preserve karte hain jis par aap baad mein filter kar sako. Principle hai 'garbage in, garbage out' — careful loading aur parsing baaki sab ka aadhaar hain.

**Key Interview Points**

* Read varied sources (PDF/HTML/CSV/Docx/...) into Document objects.

* Normalize to text \+ metadata (source, page, type).

* First step of RAG; keeps downstream stages format-agnostic.

* Parsing quality drives chunk/embedding/retrieval quality.

* Preserve clean text and useful metadata for later filtering.

**Real-World Example**

A RAG system over a company's mixed knowledge base uses different loaders for PDFs (one Document per page), the support wiki (HTML), and a product CSV (one Document per row) — all normalized into the same Document shape so chunking and embedding treat them uniformly.

**Code — Full & Runnable (Python)**

*Real LangChain document-loader code. The Python-runnable demo below parses txt/markdown/CSV into normalized Document objects so the loading step is verifiable here.*

\# Document loaders & parsing — turn varied files into clean text (LangChain loaders).  
from langchain\_community.document\_loaders import (  
    PyPDFLoader, TextLoader, CSVLoader, WebBaseLoader,  
)  
   
\# Each loader returns a list of Document objects: .page\_content (text) \+ .metadata.  
def load\_any(path: str):  
    if path.endswith(".pdf"):  
        return PyPDFLoader(path).load()        \# one Document per page  
    if path.endswith(".csv"):  
        return CSVLoader(path).load()          \# one Document per row  
    if path.startswith("http"):  
        return WebBaseLoader(path).load()      \# fetch \+ strip HTML  
    return TextLoader(path).load()  
   
\# docs \= load\_any("handbook.pdf")  
\# print(docs\[0\].page\_content\[:200\], docs\[0\].metadata)  
   
\# Clean parsing is foundational: bad extraction (broken tables, headers/footers, OCR  
\# errors) leads to bad chunks and poor retrieval. Inspect parsed output before indexing.

**Test / Demo & Expected Output (Python-runnable)**

\# Document loaders & parsing — extract clean text from varied formats into a common shape  
def load\_txt(content): return content.strip()  
def load\_csv(content):  
    rows \= \[line.split(",") for line in content.strip().splitlines()\]  
    header, \*data \= rows  
    return "\\n".join(", ".join(f"{h}={c}" for h, c in zip(header, row)) for row in data)  
def load\_html(content):  
    import re  
    text \= re.sub(r"\<\[^\>\]+\>", " ", content)        \# strip tags  
    return re.sub(r"\\s+", " ", text).strip()  
   
LOADERS \= {"txt": load\_txt, "csv": load\_csv, "html": load\_html}  
def load(filename, content):  
    ext \= filename.rsplit(".", 1)\[-1\]  
    text \= LOADERS\[ext\](content)  
    return {"source": filename, "text": text}        \# common Document shape  
   
docs \= \[  
    load("notes.txt", "  Hello world  "),  
    load("people.csv", "name,role\\nAsha,dev\\nRavi,pm"),  
    load("page.html", "\<h1\>Title\</h1\>\<p\>Body text\</p\>"),  
\]  
for d in docs:  
    print(f"{d\['source'\]:11} \-\> {d\['text'\]\!r}")  
assert docs\[0\]\["text"\] \== "Hello world"  
assert "name=Asha" in docs\[1\]\["text"\] and "role=dev" in docs\[1\]\["text"\] and "\<" not in docs\[2\]\["text"\]  
print("Loaders read PDFs, DOCX, HTML, CSV, etc., and normalize them into clean text \+ metadata.")  
print("Clean parsing is critical: garbage in (bad extraction) means garbage retrieval later.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# notes.txt   \-\> 'Hello world'  
\# people.csv  \-\> 'name=Asha, role=dev\\nname=Ravi, role=pm'  
\# page.html   \-\> 'Title Body text'  
\# Loaders read PDFs, DOCX, HTML, CSV, etc., and normalize them into clean text \+ metadata.  
\# Clean parsing is critical: garbage in (bad extraction) means garbage retrieval later.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What does a document loader produce?**

A: Document objects containing the parsed text (page\_content) and metadata (source, page number, type), normalized across formats so the rest of the pipeline doesn't care about the original file type.

**Q: Why does parsing quality matter so much?**

A: Poorly extracted text (garbled PDFs, lost structure) leads to bad chunks, weak embeddings, and irrelevant retrieval. Clean parsing is the foundation of good RAG — garbage in, garbage out.

**Q: What metadata is useful to capture?**

A: Source/filename, page or section, document type, dates, and any tags — so you can later filter retrieval (e.g., only this product's docs) and cite where an answer came from.

## **37\. Chunking**

**Simple Explanation**

Chunking splits documents into smaller pieces before embedding, because embeddings and retrieval work best on focused passages, and chunks must fit the embedding model and leave room in the context window. Each chunk is embedded and stored separately so retrieval can return just the relevant parts of a long document.

Two key parameters are chunk size and overlap. Overlap repeats a bit of text between consecutive chunks so context isn't lost at boundaries (a sentence split across two chunks). Tuning these is one of the biggest levers on RAG quality: too-large chunks bring noise and cost, too-small chunks lose context.

**Hinglish Explanation**

Chunking documents ko embedding se pehle chhote pieces mein split karti hai, kyunki embeddings aur retrieval focused passages par best kaam karte hain, aur chunks ko embedding model mein fit hona chahiye aur context window mein room chhodna chahiye. Har chunk alag se embed aur store hota hai taaki retrieval ek lambe document ke sirf relevant parts wapas kar sake.

Do key parameters hain chunk size aur overlap. Overlap consecutive chunks ke beech thoda text repeat karta hai taaki boundaries par context na khoye (ek sentence do chunks mein split). Inhe tune karna RAG quality par sabse bade levers mein se ek hai: bahut-bade chunks noise aur cost laate hain, bahut-chhote chunks context khote hain.

**Key Interview Points**

* Split documents into smaller pieces before embedding.

* Each chunk is embedded and stored separately for focused retrieval.

* Chunk size: too big \= noise/cost; too small \= lost context.

* Overlap repeats text across boundaries to preserve continuity.

* Tuning size/overlap is a major lever on RAG quality.

**Real-World Example**

Indexing a 50-page manual, a team splits it into \~1000-character chunks with 200-character overlap. A question about one procedure then retrieves just the relevant chunk(s) — not the whole manual — and the overlap ensures a step that straddles a boundary isn't cut off.

**Code — Full & Runnable (Python)**

*Real LangChain RecursiveCharacterTextSplitter code. The Python-runnable demo below splits text into overlapping chunks so the boundaries and overlap are verifiable here.*

\# Chunking — split documents into retrievable pieces with overlap (LangChain).  
from langchain\_text\_splitters import RecursiveCharacterTextSplitter  
   
splitter \= RecursiveCharacterTextSplitter(  
    chunk\_size=1000,      \# target characters per chunk  
    chunk\_overlap=200,    \# overlap keeps context across boundaries  
    separators=\["\\n\\n", "\\n", ". ", " ", ""\],  \# try paragraph \-\> line \-\> sentence \-\> word  
)  
   
\# chunks \= splitter.split\_documents(docs)   \# \-\> list of smaller Documents  
\# Or split raw text directly:  
\# pieces \= splitter.split\_text(long\_text)  
   
\# Why chunk: embeddings and context windows have size limits, and smaller, focused  
\# chunks retrieve more precisely. Overlap prevents splitting an idea across two chunks.  
\# Tune chunk\_size/overlap to your content (prose vs code vs tables) and embedding model.

**Test / Demo & Expected Output (Python-runnable)**

\# Chunking — split long text into smaller pieces (with overlap) so it fits and retrieves well  
def chunk\_text(text, chunk\_size, overlap):  
    words \= text.split()  
    chunks, start \= \[\], 0  
    while start \< len(words):  
        end \= start \+ chunk\_size  
        chunks.append(" ".join(words\[start:end\]))  
        if end \>= len(words): break  
        start \= end \- overlap          \# step back by 'overlap' to keep continuity  
    return chunks  
   
text \= " ".join(f"w{i}" for i in range(1, 13))   \# 12 words: w1..w12  
chunks \= chunk\_text(text, chunk\_size=5, overlap=2)  
for i, c in enumerate(chunks):  
    print(f"chunk {i}: {c}")  
assert chunks\[0\] \== "w1 w2 w3 w4 w5"  
assert chunks\[1\].startswith("w4 w5"), "overlap preserves context across chunks"  
assert len(chunks) \== 4  
print("Chunking breaks documents into retrievable units; overlap avoids cutting ideas at boundaries.")  
print("Chunk size trades off: too big \= noisy/expensive context, too small \= lost context.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# chunk 0: w1 w2 w3 w4 w5  
\# chunk 1: w4 w5 w6 w7 w8  
\# chunk 2: w7 w8 w9 w10 w11  
\# chunk 3: w10 w11 w12  
\# Chunking breaks documents into retrievable units; overlap avoids cutting ideas at boundaries.  
\# Chunk size trades off: too big \= noisy/expensive context, too small \= lost context.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why chunk documents at all?**

A: Retrieval and embeddings are most effective on focused passages, chunks must fit the embedding model, and retrieving small relevant pieces (not whole documents) keeps the context precise and within the window.

**Q: What does overlap do?**

A: It repeats a portion of text between adjacent chunks so information spanning a boundary isn't lost — preserving context for sentences or ideas split across chunks.

**Q: How do you choose chunk size?**

A: Balance context vs precision: large chunks add noise and cost; small chunks lose context. Tune to your content and evaluate retrieval quality (e.g., with RAGAS) to find the sweet spot.

## **38\. Chunking strategies (recursive / semantic)**

**Simple Explanation**

How you chunk matters as much as how big. Fixed-size splitting can cut mid-sentence, harming coherence. Recursive character splitting tries a hierarchy of separators — paragraphs, then sentences, then words — keeping each chunk under the size limit while respecting natural boundaries, which makes it the robust default.

Semantic chunking goes further: it splits where meaning shifts (using embedding distance between consecutive sentences), so each chunk is topically cohesive even when paragraph structure is messy. It's more expensive but can improve retrieval on mixed-topic documents. Start with recursive splitting and adopt semantic chunking when retrieval quality demands it — and always evaluate.

**Hinglish Explanation**

Aap kaise chunk karte ho ye utna hi matter karta hai jitna kitna bada. Fixed-size splitting mid-sentence cut kar sakti hai, coherence ko nuksan pahunchakar. Recursive character splitting separators ki ek hierarchy try karti hai — paragraphs, phir sentences, phir words — har chunk ko size limit ke neeche rakhte hue natural boundaries respect karke, jo use robust default banata hai.

Semantic chunking aage badhti hai: ye wahan split karti hai jahan meaning shift hota hai (consecutive sentences ke beech embedding distance use karke), to har chunk topically cohesive hota hai chahe paragraph structure messy ho. Ye zyada expensive hai par mixed-topic documents par retrieval improve kar sakti hai. Recursive splitting se shuru karo aur semantic chunking tab apnao jab retrieval quality demand kare — aur hamesha evaluate karo.

**Key Interview Points**

* Fixed-size splitting can cut mid-sentence — hurts coherence.

* Recursive: try paragraph \-\> sentence \-\> word boundaries (robust default).

* Semantic: split where meaning shifts (embedding distance) for cohesive chunks.

* Semantic is costlier but better on mixed-topic documents.

* Start recursive; adopt semantic when retrieval quality needs it; always evaluate.

**Real-World Example**

A legal-docs RAG kept retrieving chunks that ended mid-clause with fixed splitting. Switching to recursive splitting (respecting sentence/paragraph boundaries) produced coherent chunks and noticeably better retrieval — and semantic chunking helped further on documents mixing several topics.

**Code — Full & Runnable (Python)**

*Real LangChain RecursiveCharacterTextSplitter and SemanticChunker code. The Python-runnable demo below compares naive vs recursive splitting so the boundary-awareness is verifiable here.*

\# Chunking strategies — recursive (structure-aware) and semantic (meaning-aware).  
from langchain\_text\_splitters import RecursiveCharacterTextSplitter  
   
\# 1\) Recursive: split on the largest natural boundary first (paragraph, then line,  
\#    then sentence, then word) so chunks rarely cut mid-thought. Good default.  
recursive \= RecursiveCharacterTextSplitter(chunk\_size=800, chunk\_overlap=100)  
   
\# 2\) Semantic: split where the topic shifts, detected via embedding similarity  
\#    between consecutive sentences (keeps each chunk on one coherent idea).  
from langchain\_experimental.text\_splitter import SemanticChunker  
from langchain\_openai import OpenAIEmbeddings  
semantic \= SemanticChunker(OpenAIEmbeddings(), breakpoint\_threshold\_type="percentile")  
   
\# Other specialized splitters: by Markdown headers, by code structure (language-aware),  
\# or token-based splitting to align exactly with the model's tokenizer.  
\# chunks \= semantic.create\_documents(\[long\_text\])  
   
\# Pick by content: recursive for general prose/docs; semantic for mixed-topic text  
\# where clean topical boundaries materially improve retrieval quality.

**Test / Demo & Expected Output (Python-runnable)**

\# Chunking strategies — fixed vs recursive (respect natural boundaries) vs semantic  
def fixed\_chunk(text, size):  
    words \= text.split()  
    return \[" ".join(words\[i:i+size\]) for i in range(0, len(words), size)\]  
   
def recursive\_chunk(text, max\_chars):  
    \# Split on the largest natural boundary that keeps chunks under the limit.  
    \# Order of separators: paragraphs \-\> sentences \-\> words.  
    for sep in \["\\n\\n", ". ", " "\]:  
        parts \= text.split(sep)  
        chunks, cur \= \[\], ""  
        for p in parts:  
            piece \= (cur \+ sep \+ p).strip(sep) if cur else p  
            if len(piece) \<= max\_chars:  
                cur \= piece  
            else:  
                if cur: chunks.append(cur)  
                cur \= p  
        if cur: chunks.append(cur)  
        if all(len(c) \<= max\_chars for c in chunks):  
            return chunks  
    return chunks  
   
text \= ("Intro sentence one. Intro sentence two.\\n\\n"  
        "Second paragraph here. It has two sentences.")  
fixed \= fixed\_chunk(text, 4\)  
rec \= recursive\_chunk(text, max\_chars=40)  
print("Fixed (4 words):", fixed\[:2\], "...")  
print("Recursive (\<=40 chars):")  
for c in rec: print("  \-", repr(c))  
assert all(len(c) \<= 40 for c in rec), "recursive respects the size limit"  
assert len(rec) \>= 2, "splits at natural boundaries"  
print("\\nFixed: simple but cuts mid-sentence. Recursive: splits on paragraphs/sentences first (cleaner).")  
print("Semantic chunking groups text by meaning (embedding similarity) for the most coherent chunks.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Fixed (4 words): \['Intro sentence one. Intro', 'sentence two. Second paragraph'\] ...  
\# Recursive (\<=40 chars):  
\#   \- 'Intro sentence one. Intro sentence'  
\#   \- 'two.\\n\\nSecond paragraph here. It has two'  
\#   \- 'sentences.'  
\#   
\# Fixed: simple but cuts mid-sentence. Recursive: splits on paragraphs/sentences first (cleaner).  
\# Semantic chunking groups text by meaning (embedding similarity) for the most coherent chunks.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What is recursive character splitting?**

A: A strategy that tries progressively smaller separators (paragraphs, then sentences, then words) to keep chunks under a size limit while respecting natural boundaries — avoiding mid-sentence cuts. It's the robust default.

**Q: How does semantic chunking differ?**

A: It splits based on meaning — detecting where topics shift via embedding distance between sentences — producing topically cohesive chunks, at higher computational cost. Useful for mixed-topic documents.

**Q: Which strategy should you use?**

A: Start with recursive splitting (fast, reliable). Move to semantic chunking when documents mix topics and retrieval quality is critical. Tune size/overlap and evaluate (e.g., RAGAS) to decide.

## **39\. Indexing**

**Simple Explanation**

Indexing is the process of embedding all your chunks once and storing the vectors in a structure built for fast similarity search. It decouples the expensive embedding step (done up front) from cheap, repeated retrieval — so queries don't re-embed the corpus every time.

Small setups can store vectors in a simple list and scan them, but production indexes use ANN structures (HNSW, IVF) so search stays fast as the corpus grows to millions of vectors. Indexes are typically persisted to disk or a managed service, and you re-index when documents change. Good indexing is what makes retrieval scalable.

**Hinglish Explanation**

Indexing wo process hai jisme aap apne saare chunks ko ek baar embed karke vectors ko ek structure mein store karte ho jo fast similarity search ke liye bana ho. Ye expensive embedding step (pehle se kiya) ko cheap, repeated retrieval se decouple karta hai — to queries har baar corpus dobara embed nahi karti.

Chhote setups vectors ko ek simple list mein store karke scan kar sakte hain, par production indexes ANN structures (HNSW, IVF) use karte hain taaki corpus millions vectors tak badhne par bhi search fast rahe. Indexes aksar disk ya managed service par persist hote hain, aur documents badalne par aap re-index karte ho. Achhi indexing hi retrieval ko scalable banati hai.

**Key Interview Points**

* Embed all chunks once and store vectors for fast search.

* Decouples expensive embedding from cheap, repeated retrieval.

* Production uses ANN indexes (HNSW, IVF) to scale to millions.

* Persist the index to disk or a managed service.

* Re-index when documents change; good indexing makes retrieval scalable.

**Real-World Example**

A docs search builds a FAISS index from the embedded chunks and saves it to disk. The app loads that index on startup and serves thousands of queries without re-embedding anything — only re-indexing nightly when the documentation is updated.

**Code — Full & Runnable (Python)**

*Real LangChain \+ FAISS indexing code. The Python-runnable demo below builds a reusable vector index over chunks so the embed-once/query-many idea is verifiable here.*

\# Indexing — embed all chunks once and store them for fast repeated retrieval.  
from langchain\_openai import OpenAIEmbeddings  
from langchain\_community.vectorstores import FAISS  
   
embeddings \= OpenAIEmbeddings(model="text-embedding-3-small")  
   
\# Build the index from chunks (embeds them and stores vectors \+ text \+ metadata).  
\# vectorstore \= FAISS.from\_documents(chunks, embeddings)  
   
\# Persist so you don't re-embed every run (re-embedding is the expensive part):  
\# vectorstore.save\_local("faiss\_index")  
\# vectorstore \= FAISS.load\_local("faiss\_index", embeddings, allow\_dangerous\_deserialization=True)  
   
\# Indexing is a one-time (or incremental) preprocessing step. At query time you reuse  
\# the index; for large corpora an ANN index (HNSW/IVF) keeps search fast as data grows.

**Test / Demo & Expected Output (Python-runnable)**

\# Indexing — precompute embeddings \+ a lookup structure so retrieval is fast  
import hashlib, math  
def embed(text, dim=8):  
    v=\[0.0\]\*dim  
    for w in text.lower().split():  
        v\[int(hashlib.md5(w.encode()).hexdigest(),16)%dim\]+=1.0  
    n=math.sqrt(sum(x\*x for x in v)) or 1.0  
    return \[x/n for x in v\]  
   
class VectorIndex:  
    def \_\_init\_\_(self): self.ids=\[\]; self.vectors=\[\]; self.texts=\[\]  
    def build(self, documents):  
        \# One-time: embed every chunk and store it for fast repeated queries.  
        for i, doc in enumerate(documents):  
            self.ids.append(i); self.texts.append(doc); self.vectors.append(embed(doc))  
        return len(self.vectors)  
    def stats(self):  
        return {"vectors": len(self.vectors), "dim": len(self.vectors\[0\]) if self.vectors else 0}  
   
docs \= \["the cat sat", "the dog ran", "machine learning models", "deep neural networks"\]  
idx \= VectorIndex()  
n \= idx.build(docs)  
print("Indexed", n, "documents \-\>", idx.stats())  
assert idx.stats()\["vectors"\] \== 4 and idx.stats()\["dim"\] \== 8  
print("Indexing \= embedding all chunks up front and storing them (often in an ANN structure).")  
print("You index once; then every query reuses the index instead of re-embedding the corpus.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Indexed 4 documents \-\> {'vectors': 4, 'dim': 8}  
\# Indexing \= embedding all chunks up front and storing them (often in an ANN structure).  
\# You index once; then every query reuses the index instead of re-embedding the corpus.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What does indexing accomplish?**

A: It precomputes and stores chunk embeddings in a search-optimized structure, so retrieval is fast and repeatable without re-embedding the corpus on every query.

**Q: Why use an ANN index?**

A: Brute-force search is linear in the number of vectors. ANN indexes (HNSW, IVF) give sub-linear search, keeping retrieval fast as the corpus scales to millions of vectors.

**Q: When do you re-index?**

A: When the underlying documents change — added, updated, or removed — so the index reflects current content. Many systems re-index incrementally or on a schedule.

## **40\. Retrieval pipeline**

**Simple Explanation**

The retrieval pipeline turns a user query into the most relevant chunks. It embeds the query with the same model used for the documents, searches the index for the nearest vectors, and returns the top-k chunks. A retriever object usually wraps this with a search configuration (k, search type, filters).

Retrieval quality caps the quality of the whole RAG system — if the right context isn't retrieved, the LLM can't answer well no matter how good it is. Options like the number of chunks (k), MMR for diversity, and metadata filters tune what gets retrieved. The returned chunks become the context for generation.

**Hinglish Explanation**

Retrieval pipeline ek user query ko sabse relevant chunks mein badalti hai. Ye query ko usi model se embed karti hai jo documents ke liye use hua, index mein nearest vectors search karti hai, aur top-k chunks wapas karti hai. Ek retriever object aksar ise ek search configuration (k, search type, filters) ke saath wrap karta hai.

Retrieval quality poore RAG system ki quality ko cap karti hai — agar sahi context retrieve nahi hua, to LLM achha answer nahi de sakta chahe wo kitna bhi achha ho. Options jaise chunks ki sankhya (k), diversity ke liye MMR, aur metadata filters tune karte hain ki kya retrieve ho. Returned chunks generation ke liye context ban jaate hain.

**Key Interview Points**

* Query \-\> embed (same model as docs) \-\> search index \-\> return top-k.

* A retriever wraps this with config (k, search type, filters).

* Retrieval quality caps the whole RAG system's quality.

* Tune k, use MMR for diversity, and metadata filters for precision.

* Returned chunks become the generation context.

**Real-World Example**

A support bot's retriever is configured with k=4 and a metadata filter for the user's product. For each question it embeds the query, pulls the four most relevant chunks for that product, and passes them to the LLM — so answers stay relevant and product-specific.

**Code — Full & Runnable (Python)**

*Real LangChain retriever code. The Python-runnable demo below runs query → embed → search → top-k so the end-to-end retrieval flow is verifiable here.*

\# Retrieval pipeline — load \-\> split \-\> embed/index \-\> retrieve, as a reusable retriever.  
from langchain\_community.document\_loaders import PyPDFLoader  
from langchain\_text\_splitters import RecursiveCharacterTextSplitter  
from langchain\_openai import OpenAIEmbeddings  
from langchain\_community.vectorstores import FAISS  
   
def build\_retriever(pdf\_path, k=4):  
    docs \= PyPDFLoader(pdf\_path).load()                                  \# 1\) load  
    chunks \= RecursiveCharacterTextSplitter(  
        chunk\_size=1000, chunk\_overlap=200).split\_documents(docs)       \# 2\) split  
    store \= FAISS.from\_documents(chunks, OpenAIEmbeddings())            \# 3\) embed \+ index  
    return store.as\_retriever(search\_kwargs={"k": k})                   \# 4\) retriever  
   
\# retriever \= build\_retriever("handbook.pdf")  
\# relevant\_docs \= retriever.invoke("What is the refund policy?")  \# top-k chunks  
   
\# This retriever is the "R" in RAG; its output feeds the prompt for generation.  
\# Common upgrades: metadata filters, MMR for diversity, and a reranking stage.

**Test / Demo & Expected Output (Python-runnable)**

\# Retrieval pipeline — the end-to-end flow: load \-\> chunk \-\> embed/index \-\> retrieve  
import hashlib, math  
def embed(text, dim=8):  
    v=\[0.0\]\*dim  
    for w in text.lower().split():  
        v\[int(hashlib.md5(w.encode()).hexdigest(),16)%dim\]+=1.0  
    n=math.sqrt(sum(x\*x for x in v)) or 1.0  
    return \[x/n for x in v\]  
def cosine(a,b):  
    d=sum(x\*y for x,y in zip(a,b)); na=math.sqrt(sum(x\*x for x in a)); nb=math.sqrt(sum(y\*y for y in b))  
    return d/(na\*nb) if na and nb else 0.0  
   
def pipeline(raw\_text, query, chunk\_size=4, k=2):  
    \# 1\) chunk  
    words \= raw\_text.split()  
    chunks \= \[" ".join(words\[i:i+chunk\_size\]) for i in range(0, len(words), chunk\_size)\]  
    \# 2\) embed \+ index  
    index \= \[(c, embed(c)) for c in chunks\]  
    \# 3\) embed query and retrieve top-k  
    qv \= embed(query)  
    ranked \= sorted(index, key=lambda ce: cosine(qv, ce\[1\]), reverse=True)  
    return \[c for c, \_ in ranked\[:k\]\]  
   
text \= "python is great python is fast cooking pasta needs water boil the pasta"  
results \= pipeline(text, "tell me about python", k=2)  
print("Retrieved chunks:", results)  
assert any("python" in c for c in results), "retrieves the relevant chunks"  
print("Retrieval pipeline: load \-\> chunk \-\> embed & index \-\> embed query \-\> top-k similarity.")  
print("This is the 'R' in RAG; its output becomes the context for generation.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Retrieved chunks: \['needs water boil the', 'python is great python'\]  
\# Retrieval pipeline: load \-\> chunk \-\> embed & index \-\> embed query \-\> top-k similarity.  
\# This is the 'R' in RAG; its output becomes the context for generation.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What are the steps of a retrieval pipeline?**

A: Embed the query with the same model as the documents, search the vector index for nearest neighbors, and return the top-k most relevant chunks to use as context.

**Q: Why is retrieval the bottleneck for RAG quality?**

A: The LLM can only answer from the context it's given. If retrieval misses the relevant chunks, even the best model will produce a poor or hallucinated answer.

**Q: What is MMR in retrieval?**

A: Maximal Marginal Relevance — a search mode that balances relevance with diversity, reducing near-duplicate chunks so the retrieved set covers more distinct, useful information.

## **41\. Semantic retrieval**

**Simple Explanation**

Semantic retrieval is the embedding-based retrieval at the heart of RAG: documents and the query live in the same vector space, so the system finds chunks by meaning rather than literal keyword overlap. A query like 'inexpensive trips' can retrieve 'affordable vacation ideas' with no shared words.

It's the default retrieval mode because it handles synonyms, paraphrases, and natural-language questions that keyword search fumbles. Its limitation is exact-term queries (specific codes, names, IDs), where literal matching is better — which is why production systems often combine semantic retrieval with keyword search (hybrid).

**Hinglish Explanation**

Semantic retrieval embedding-based retrieval hai jo RAG ke dil mein hai: documents aur query same vector space mein hote hain, to system chunks ko meaning se dhoondhta hai, literal keyword overlap se nahi. 'inexpensive trips' jaisi query 'affordable vacation ideas' retrieve kar sakti hai bina kisi shared word ke.

Ye default retrieval mode hai kyunki ye synonyms, paraphrases, aur natural-language questions handle karta hai jinhe keyword search fumble karti hai. Iski limitation exact-term queries hai (specific codes, names, IDs), jahan literal matching behtar hai — isiliye production systems aksar semantic retrieval ko keyword search ke saath combine karte hain (hybrid).

**Key Interview Points**

* Embedding-based retrieval — finds chunks by meaning, not keywords.

* Documents and query share the same vector space.

* Handles synonyms, paraphrases, and natural-language questions.

* The default retrieval mode in RAG.

* Weaker on exact terms (codes/names) — combine with keyword (hybrid).

**Real-World Example**

A knowledge-base assistant retrieves the right onboarding doc when an employee asks 'how do I get set up on day one?' even though the doc is titled 'New Hire Provisioning Checklist' — semantic retrieval matches the intent despite zero keyword overlap.

**Code — Full & Runnable (Python)**

*Real LangChain/Chroma retriever code. The Python-runnable demo below retrieves docs that share no keywords with the query so meaning-based retrieval is verifiable here.*

\# Semantic retrieval — retrieve by meaning; optionally use MMR for diverse results.  
from langchain\_openai import OpenAIEmbeddings  
from langchain\_community.vectorstores import FAISS  
   
\# store \= FAISS.from\_documents(chunks, OpenAIEmbeddings())  
   
\# Plain semantic similarity (top-k by cosine):  
\# retriever \= store.as\_retriever(search\_kwargs={"k": 5})  
   
\# Maximal Marginal Relevance: relevant AND diverse (reduces near-duplicate chunks):  
\# retriever \= store.as\_retriever(  
\#     search\_type="mmr", search\_kwargs={"k": 5, "fetch\_k": 20, "lambda\_mult": 0.5})  
   
\# results \= retriever.invoke("how do I cancel my subscription?")  
   
\# Semantic retrieval embeds query and documents into the same space and ranks by  
\# similarity, so it matches intent even when the user's words differ from the source.

**Test / Demo & Expected Output (Python-runnable)**

\# Semantic retrieval — retrieve by meaning, and see why keyword retrieval misses  
import math  
docs \= {  
    "d1": ("Resetting a forgotten password",  \[1,0,0\]),  
    "d2": ("Troubleshooting sign-in failures", \[0.9,0.1,0\]),  
    "d3": ("Updating your billing card",       \[0,1,0\]),  
}  
def embed\_q(q):  
    q=q.lower()  
    return \[1.0 if any(w in q for w in ("login","log in","sign in","password","access")) else 0.0,  
            1.0 if any(w in q for w in ("billing","card","pay")) else 0.0, 0.0\]  
def cosine(a,b):  
    d=sum(x\*y for x,y in zip(a,b)); na=math.sqrt(sum(x\*x for x in a)); nb=math.sqrt(sum(y\*y for y in b))  
    return d/(na\*nb) if na and nb else 0.0  
   
def keyword\_retrieve(query):  
    qwords \= set(query.lower().split())  
    hits \= \[k for k,(text,\_) in docs.items() if qwords & set(text.lower().split())\]  
    return hits  
def semantic\_retrieve(query, k=1):  
    qv \= embed\_q(query)  
    return \[k for k,\_ in sorted(docs.items(), key=lambda kv: cosine(qv, kv\[1\]\[1\]), reverse=True)\[:k\]\]  
   
q \= "I can't access my account"  
print("Keyword retrieval:", keyword\_retrieve(q), "(no shared words \-\> misses)")  
print("Semantic retrieval:", semantic\_retrieve(q), "-\>", docs\[semantic\_retrieve(q)\[0\]\]\[0\])  
assert keyword\_retrieve(q) \== \[\], "keyword search finds nothing"  
assert semantic\_retrieve(q)\[0\] in ("d1","d2"), "semantic search finds the right doc"  
print("Semantic retrieval embeds query \+ docs and ranks by similarity \\u2014 robust to wording differences.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Keyword retrieval: \[\] (no shared words \-\> misses)  
\# Semantic retrieval: \['d1'\] \-\> Resetting a forgotten password  
\# Semantic retrieval embeds query \+ docs and ranks by similarity — robust to wording differences.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What makes retrieval 'semantic'?**

A: It compares the query and documents as embeddings in a shared vector space, so relevance is based on meaning. Synonyms and paraphrases match even without shared keywords.

**Q: Where does semantic retrieval struggle?**

A: On exact-term lookups — specific identifiers, codes, names — where literal keyword matching is more precise. Hybrid search adds keyword matching to cover those cases.

**Q: Is semantic retrieval the same as semantic search?**

A: Essentially yes — 'semantic retrieval' usually refers to the retrieval step inside RAG, while 'semantic search' is the general capability. Both rank by embedding similarity.

## **42\. Context injection**

**Simple Explanation**

Context injection is the 'augment' step of RAG: the retrieved chunks are formatted into the prompt so the model answers from them. A typical template includes an instruction ('answer using only the context below'), the joined chunks, and the user's question, telling the model exactly where to ground its response.

Two things matter: clear instructions to use only the provided context (which curbs hallucination and can ask the model to say 'I don't know'), and respecting the token budget — you must select or trim chunks so the prompt plus the expected answer fit within the context window. How you order and format chunks can also affect answer quality.

**Hinglish Explanation**

Context injection RAG ka 'augment' step hai: retrieved chunks ko prompt mein format kiya jaata hai taaki model unse answer de. Ek typical template mein ek instruction hota hai ('neeche diye context se hi answer do'), joined chunks, aur user ka question, model ko exactly batate hue kahan apna response ground kare.

Do cheezein matter karti hain: sirf provided context use karne ke clear instructions (jo hallucination ko rokte hain aur model se 'I don't know' kehne ko keh sakte hain), aur token budget respect karna — aap chunks select ya trim karo taaki prompt plus expected answer context window mein fit hon. Aap chunks ko kaise order aur format karte ho wo bhi answer quality ko affect kar sakta hai.

**Key Interview Points**

* The 'augment' step: format retrieved chunks into the prompt.

* Template \= instruction \+ joined context \+ the question.

* Instruct the model to use ONLY the context (curbs hallucination).

* Respect the token budget: select/trim chunks to fit the window.

* Ordering and formatting of chunks can affect answer quality.

**Real-World Example**

A RAG prompt template reads: 'Answer using only the context below. If it's not there, say you don't know. Context: \[chunks\]. Question: \[user question\].' This grounding instruction stops the model from inventing answers when the retrieved context lacks the information.

**Code — Full & Runnable (Python)**

*Real LangChain prompt \+ chain code. The Python-runnable demo below formats retrieved chunks into a prompt within a token budget so the injection step is verifiable here.*

\# Context injection — put retrieved chunks into the prompt within the token budget.  
from langchain\_core.prompts import ChatPromptTemplate  
   
RAG\_PROMPT \= ChatPromptTemplate.from\_template(  
    "Answer the question using ONLY the context below. "  
    "If the answer isn't there, say you don't know.\\n\\n"  
    "Context:\\n{context}\\n\\nQuestion: {question}"  
)  
   
def format\_docs(docs):  
    \# Join retrieved chunks; in production, cap total tokens and add source labels.  
    return "\\n\\n".join(f"\[{i+1}\] {d.page\_content}" for i, d in enumerate(docs))  
   
\# retrieved \= retriever.invoke(question)  
\# prompt \= RAG\_PROMPT.format(context=format\_docs(retrieved), question=question)  
\# answer \= llm.invoke(prompt)  
   
\# Key concerns: include only the most relevant chunks, stay within the context window  
\# (leave room for the answer), and label sources so the model can cite them.

**Test / Demo & Expected Output (Python-runnable)**

\# Context injection — insert retrieved chunks into the prompt within a token budget  
def count\_tokens(text): return max(1, len(text)//4)  
   
def build\_prompt(question, retrieved\_chunks, token\_budget=40):  
    \# Add chunks until the budget is hit, then assemble the grounded prompt.  
    context, used \= \[\], 0  
    for chunk in retrieved\_chunks:  
        t \= count\_tokens(chunk)  
        if used \+ t \> token\_budget: break  
        context.append(chunk); used \+= t  
    context\_block \= "\\n".join(f"- {c}" for c in context)  
    prompt \= (f"Answer using ONLY this context:\\n{context\_block}\\n\\nQuestion: {question}")  
    return prompt, used  
   
chunks \= \["Return window is 30 days.", "Free shipping over $50.",  
          "Stores open 9 to 9.", "Loyalty points never expire."\]  
prompt, used \= build\_prompt("What is the return window?", chunks, token\_budget=20)  
print(prompt)  
print("\\nTokens used by context:", used)  
assert "30 days" in prompt and "ONLY this context" in prompt  
assert used \<= 20, "respects the token budget"  
print("\\nContext injection places retrieved chunks into the prompt so the model answers from them.")  
print("Manage the budget: include the most relevant chunks and leave room for the question \+ answer.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Answer using ONLY this context:  
\# \- Return window is 30 days.  
\# \- Free shipping over $50.  
\# \- Stores open 9 to 9\.  
\#   
\# Question: What is the return window?  
\#   
\# Tokens used by context: 15  
\#   
\# Context injection places retrieved chunks into the prompt so the model answers from them.  
\# Manage the budget: include the most relevant chunks and leave room for the question \+ answer.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What is context injection in RAG?**

A: The step of inserting retrieved chunks into the prompt — usually with an instruction to answer only from that context — so the model generates a grounded response.

**Q: Why instruct the model to use only the context?**

A: It reduces hallucination by tying the answer to retrieved sources, and lets the model abstain ('I don't know') when the context lacks the answer instead of inventing one.

**Q: How do you handle the token budget when injecting context?**

A: Select or trim chunks (and reserve room for the answer) so the full prompt fits the context window — e.g., limit k, summarize, or drop the least relevant chunks.

## **43\. Reranking basics**

**Simple Explanation**

Reranking is a second stage that reorders retrieved candidates by true relevance. First-stage vector retrieval is fast and recall-oriented — it casts a wide net (a high k) but can include loosely related or ambiguous results. A reranker then scores each candidate against the query more precisely and keeps the best few.

This retrieve-then-rerank pattern improves the quality of the context the LLM sees: you retrieve many cheaply, then promote the genuinely relevant chunks to the top before injection. It's one of the most effective and common ways to boost RAG accuracy, especially for ambiguous queries where pure vector similarity is imperfect.

**Hinglish Explanation**

Reranking ek second stage hai jo retrieved candidates ko true relevance se reorder karti hai. First-stage vector retrieval fast aur recall-oriented hai — ye ek wide net daalta hai (high k) par loosely related ya ambiguous results include kar sakta hai. Ek reranker phir har candidate ko query ke against zyada precisely score karke best few rakhta hai.

Ye retrieve-then-rerank pattern us context ki quality improve karta hai jo LLM dekhta hai: aap bahut saare cheaply retrieve karte ho, phir genuinely relevant chunks ko injection se pehle top par promote karte ho. Ye RAG accuracy boost karne ke sabse effective aur common tareekon mein se ek hai, khaaskar ambiguous queries ke liye jahan pure vector similarity imperfect hai.

**Key Interview Points**

* A second stage that reorders candidates by true relevance.

* First-stage retrieval: fast, high recall, but possibly noisy.

* Reranker scores each candidate vs the query more precisely.

* Retrieve many cheaply \-\> rerank \-\> keep the best few.

* One of the most effective ways to boost RAG accuracy.

**Real-World Example**

A RAG search for 'python programming' first retrieves 20 chunks — including ones about python snakes. A reranker scores them against the query's intent and pushes the programming chunks to the top, so only genuinely relevant context reaches the LLM.

**Code — Full & Runnable (Python)**

*Real LangChain \+ reranking-API code. The Python-runnable demo below reorders noisy first-stage results by relevance so the two-stage idea is verifiable here.*

\# Reranking basics — retrieve many cheaply, then reorder the top-k for precision.  
from langchain\_openai import OpenAIEmbeddings  
from langchain\_community.vectorstores import FAISS  
   
\# Stage 1: fast vector retrieval with HIGH recall (fetch more than you need).  
\# store \= FAISS.from\_documents(chunks, OpenAIEmbeddings())  
\# candidates \= store.similarity\_search(query, k=20)  
   
\# Stage 2: a precise reranker reorders those 20 and keeps the best few.  
from sentence\_transformers import CrossEncoder  
reranker \= CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")  
   
def rerank(query, candidates, top\_n=4):  
    pairs \= \[(query, doc.page\_content) for doc in candidates\]  
    scores \= reranker.predict(pairs)                       \# joint query-doc relevance  
    ranked \= sorted(zip(candidates, scores), key=lambda x: x\[1\], reverse=True)  
    return \[doc for doc, \_ in ranked\[:top\_n\]\]  
   
\# Two-stage retrieval (recall then precision) noticeably improves answer quality,  
\# because the first stage alone often ranks "close but not best" chunks too high.

**Test / Demo & Expected Output (Python-runnable)**

\# Reranking basics — cheap first-stage recall, then a precise reorder of the top candidates  
\# Stage 1: fast retriever returns many candidates by a rough score.  
candidates \= \[  
    {"id": "a", "text": "Python list comprehensions", "first\_stage": 0.71},  
    {"id": "b", "text": "How to sort a Python list", "first\_stage": 0.69},  
    {"id": "c", "text": "Python web scraping guide",  "first\_stage": 0.68},  
\]  
\# Stage 2: a slower, smarter reranker scores query-document relevance directly.  
def reranker\_score(query, text):  
    q \= set(query.lower().split()); t \= set(text.lower().split())  
    overlap \= len(q & t) / (len(q) or 1\)            \# precise relevance signal  
    return round(overlap, 3\)  
   
query \= "sort a list in python"  
for c in candidates:  
    c\["rerank"\] \= reranker\_score(query, c\["text"\])  
reranked \= sorted(candidates, key=lambda c: c\["rerank"\], reverse=True)  
print("First-stage order:", \[c\["id"\] for c in candidates\])  
print("Reranked order:   ", \[c\["id"\] for c in reranked\])  
print("Top after rerank: ", reranked\[0\]\["text"\])  
assert reranked\[0\]\["id"\] \== "b", "reranking surfaces the truly most relevant doc"  
print("Reranking: retrieve many cheaply (high recall), then reorder the top-k for precision.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# First-stage order: \['a', 'b', 'c'\]  
\# Reranked order:    \['b', 'a', 'c'\]  
\# Top after rerank:  How to sort a Python list  
\# Reranking: retrieve many cheaply (high recall), then reorder the top-k for precision.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why add a reranking stage?**

A: First-stage vector retrieval optimizes for recall and can return loosely relevant results. A reranker reorders candidates by precise relevance, ensuring the best chunks are injected — markedly improving answer quality.

**Q: What is the retrieve-then-rerank pattern?**

A: Retrieve a large set of candidates cheaply with vector search (high k), then apply a more expensive, accurate reranker to select the top few for the prompt.

**Q: Does reranking add cost/latency?**

A: Yes — it's an extra scoring step, so it's applied only to the top candidates, not the whole corpus. The accuracy gain usually justifies the modest added latency.

## **44\. Reranking models (cross-encoders)**

**Simple Explanation**

There are two ways to score query-document relevance. A bi-encoder embeds the query and the document separately and compares the vectors — fast and scalable, so it's used for first-stage retrieval over the whole corpus. A cross-encoder feeds the query and document together into the model, letting it directly model their interaction — much more accurate, but far slower.

Because cross-encoders are too slow to run over an entire corpus, they're used as rerankers on the small set of top candidates from the bi-encoder stage. The pipeline — bi-encoder retrieves top-N, cross-encoder reranks to top-k — combines the bi-encoder's speed with the cross-encoder's precision, reliably improving the context fed to the LLM.

**Hinglish Explanation**

Query-document relevance score karne ke do tareeke hain. Ek bi-encoder query aur document ko alag-alag embed karke vectors compare karta hai — fast aur scalable, isliye poore corpus par first-stage retrieval ke liye use hota hai. Ek cross-encoder query aur document ko saath model mein feed karta hai, use direct unka interaction model karne dekar — bahut zyada accurate, par kahin slower.

Kyunki cross-encoders poore corpus par chalane ke liye bahut slow hain, wo bi-encoder stage ke top candidates ke chhote set par rerankers ke roop mein use hote hain. Pipeline — bi-encoder top-N retrieve kare, cross-encoder top-k tak rerank kare — bi-encoder ki speed ko cross-encoder ki precision ke saath combine karta hai, LLM ko diye context ko reliably improve karke.

**Key Interview Points**

* Bi-encoder: embeds query and doc separately, compares vectors (fast, scalable).

* Cross-encoder: encodes query+doc together, models interaction (accurate, slow).

* Bi-encoders power first-stage retrieval over the whole corpus.

* Cross-encoders rerank the small set of top candidates.

* Pipeline: bi-encoder top-N \-\> cross-encoder top-k (speed \+ precision).

**Real-World Example**

A production RAG uses a bi-encoder to retrieve the top 50 chunks fast, then a cross-encoder reranker (like ms-marco-MiniLM) to score those 50 query-chunk pairs jointly and keep the best 5 — getting accurate context without running the slow model over millions of vectors.

**Code — Full & Runnable (Python)**

*Real sentence-transformers CrossEncoder code. The Python-runnable demo below contrasts bi-encoder and cross-encoder scoring so the accuracy difference is verifiable here.*

\# Reranking models (cross-encoders) — why they beat bi-encoders for precision.  
from sentence\_transformers import SentenceTransformer, CrossEncoder  
   
\# Bi-encoder: encodes query and doc SEPARATELY into vectors \-\> compare by cosine.  
\# Fast and scalable (precompute doc vectors), but less precise on subtle relevance.  
bi\_encoder \= SentenceTransformer("all-MiniLM-L6-v2")  
   
\# Cross-encoder: feeds (query, doc) TOGETHER through the model \-\> one relevance score.  
\# Much more accurate, but cannot precompute, so it's too slow to score the whole corpus.  
cross\_encoder \= CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")  
   
def two\_stage(query, documents, k=50, top\_n=5):  
    \# 1\) bi-encoder retrieves k candidates quickly from the full corpus  
    \# 2\) cross-encoder reranks just those k for final precision  
    pairs \= \[(query, d) for d in documents\[:k\]\]  
    scores \= cross\_encoder.predict(pairs)  
    order \= sorted(range(len(scores)), key=lambda i: scores\[i\], reverse=True)  
    return \[documents\[i\] for i in order\[:top\_n\]\]  
   
\# Rule of thumb: bi-encoder for fast recall at scale; cross-encoder to rerank the top-k.

**Test / Demo & Expected Output (Python-runnable)**

\# Reranking models (cross-encoders) — bi-encoder vs cross-encoder trade-off  
\# Bi-encoder: embed query and doc SEPARATELY, compare vectors (fast, scalable, less precise).  
\# Cross-encoder: feed (query, doc) TOGETHER into the model for a precise relevance score (slow).  
import math  
def bi\_encoder\_score(q\_vec, d\_vec):  
    d=sum(x\*y for x,y in zip(q\_vec,d\_vec)); na=math.sqrt(sum(x\*x for x in q\_vec)); nb=math.sqrt(sum(y\*y for y in d\_vec))  
    return round(d/(na\*nb),3) if na and nb else 0.0  
def cross\_encoder\_score(query, doc):  
    \# Sees query+doc jointly: rewards term overlap AND order/phrase match (toy proxy).  
    q, d \= query.lower(), doc.lower()  
    overlap \= len(set(q.split()) & set(d.split())) / (len(q.split()) or 1\)  
    phrase\_bonus \= 0.3 if q in d else 0.0  
    return round(min(1.0, overlap \+ phrase\_bonus), 3\)  
   
query \= "machine learning"  
docs \= \["intro to machine learning", "machine parts catalog", "learning to cook"\]  
qv \= \[1,1\]; dvecs \= \[\[1,1\],\[1,0\],\[0,1\]\]   \# toy bi-encoder vectors  
print("Bi-encoder scores:   ", \[bi\_encoder\_score(qv, dv) for dv in dvecs\])  
cross \= \[cross\_encoder\_score(query, d) for d in docs\]  
print("Cross-encoder scores:", cross)  
print("Cross-encoder picks: ", docs\[cross.index(max(cross))\])  
assert cross\[0\] \== max(cross), "cross-encoder ranks the true match highest"  
print("Pipeline: bi-encoder retrieves fast at scale; cross-encoder reranks the top-k for accuracy.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Bi-encoder scores:    \[1.0, 0.707, 0.707\]  
\# Cross-encoder scores: \[1.0, 0.5, 0.5\]  
\# Cross-encoder picks:  intro to machine learning  
\# Pipeline: bi-encoder retrieves fast at scale; cross-encoder reranks the top-k for accuracy.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Bi-encoder vs cross-encoder — the key difference?**

A: A bi-encoder embeds query and document independently and compares vectors (fast). A cross-encoder processes them together, modeling their interaction for higher accuracy but at much greater compute cost.

**Q: Why not use a cross-encoder for retrieval directly?**

A: It must score every query-document pair jointly, which is far too slow over a large corpus. It's reserved for reranking the small candidate set from fast bi-encoder retrieval.

**Q: What does the combined pipeline look like?**

A: Bi-encoder retrieves the top-N candidates quickly; the cross-encoder reranks them to the top-k most relevant. You get the bi-encoder's scalability plus the cross-encoder's precision.

## **45\. Hybrid search basics**

**Simple Explanation**

Hybrid search combines keyword search (lexical, like BM25) with semantic search (vector-based). Keyword search excels at exact terms — names, codes, rare tokens — while semantic search captures meaning, synonyms, and paraphrases. Fusing both typically beats either alone, especially for queries that mix exact terms and concepts.

The two result lists are merged, often with Reciprocal Rank Fusion (RRF) or a weighted blend (an alpha balancing lexical vs semantic). This covers each method's blind spot: semantic search won't miss an exact product code, and keyword search won't miss a paraphrase. Many vector databases and frameworks offer hybrid search out of the box.

**Hinglish Explanation**

Hybrid search keyword search (lexical, jaise BM25) ko semantic search (vector-based) ke saath combine karti hai. Keyword search exact terms par excel karti hai — names, codes, rare tokens — jabki semantic search meaning, synonyms, aur paraphrases capture karti hai. Dono ko fuse karna aksar akele kisi se behtar hota hai, khaaskar un queries ke liye jo exact terms aur concepts mix karti hain.

Do result lists ko merge kiya jaata hai, aksar Reciprocal Rank Fusion (RRF) ya weighted blend se (ek alpha jo lexical vs semantic balance kare). Ye har method ka blind spot cover karta hai: semantic search ek exact product code miss nahi karegi, aur keyword search ek paraphrase miss nahi karegi. Kai vector databases aur frameworks hybrid search out of the box dete hain.

**Key Interview Points**

* Combines keyword (BM25) and semantic (vector) search.

* Keyword: exact terms/codes/names; semantic: meaning/synonyms.

* Fusing both beats either alone for mixed queries.

* Merge via Reciprocal Rank Fusion (RRF) or a weighted alpha blend.

* Covers each method's blind spot; available in many DBs/frameworks.

**Real-World Example**

An e-commerce search handles 'waterproof Model X-200 jacket' best with hybrid search: keyword matching nails the exact code 'X-200', while semantic matching understands 'waterproof jacket' — together returning the right product, which neither method alone reliably finds.

**Code — Full & Runnable (Python)**

*Real LangChain EnsembleRetriever (BM25 \+ vector) code. The Python-runnable demo below fuses keyword and semantic scores so the combined benefit is verifiable here.*

\# Hybrid search — fuse keyword (BM25) and semantic retrieval for robustness.  
from langchain\_community.retrievers import BM25Retriever  
from langchain\_community.vectorstores import FAISS  
from langchain\_openai import OpenAIEmbeddings  
from langchain.retrievers import EnsembleRetriever  
   
\# Keyword retriever: great for exact terms, codes, names, rare jargon.  
\# bm25 \= BM25Retriever.from\_documents(chunks); bm25.k \= 5  
   
\# Semantic retriever: great for meaning/paraphrase.  
\# vector \= FAISS.from\_documents(chunks, OpenAIEmbeddings()).as\_retriever(search\_kwargs={"k": 5})  
   
\# Combine them with weights (the ensemble fuses and re-ranks both result sets).  
\# hybrid \= EnsembleRetriever(retrievers=\[bm25, vector\], weights=\[0.5, 0.5\])  
\# results \= hybrid.invoke("IndexError in my Python script")  
   
\# Hybrid search captures exact-term matches AND semantic matches, so it handles both  
\# "error code XJ-42" (keyword) and "app keeps crashing" (semantic) well.

**Test / Demo & Expected Output (Python-runnable)**

\# Hybrid search — combine keyword (BM25-like) and semantic scores for the best of both  
import math  
docs \= {  
    "d1": "Python error: IndexError list out of range",  
    "d2": "How to handle exceptions gracefully in code",  
    "d3": "Cooking pasta with the perfect sauce",  
}  
sem\_vectors \= {"d1":\[1,0\], "d2":\[0.8,0.2\], "d3":\[0,1\]}   \# toy semantic vectors  
def keyword\_score(query, text):  
    q \= query.lower().split()  
    return round(sum(text.lower().count(w) for w in q) / (len(q) or 1), 3\)  
def semantic\_score(qv, dv):  
    d=sum(x\*y for x,y in zip(qv,dv)); na=math.sqrt(sum(x\*x for x in qv)); nb=math.sqrt(sum(y\*y for y in dv))  
    return round(d/(na\*nb),3) if na and nb else 0.0  
   
query \= "IndexError"; qv \= \[1, 0\]  
alpha \= 0.5   \# weight between keyword and semantic  
scores \= {}  
for did, text in docs.items():  
    ks \= keyword\_score(query, text)  
    ss \= semantic\_score(qv, sem\_vectors\[did\])  
    scores\[did\] \= round(alpha\*ks \+ (1-alpha)\*ss, 3\)  
    print(f"{did}: keyword={ks} semantic={ss} hybrid={scores\[did\]}")  
best \= max(scores, key=scores.get)  
print("Best hybrid match:", best)  
assert best \== "d1", "hybrid catches the exact term AND meaning"  
print("Hybrid search fuses exact-term matching (keyword/BM25) with meaning (semantic) for robustness.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# d1: keyword=1.0 semantic=1.0 hybrid=1.0  
\# d2: keyword=0.0 semantic=0.97 hybrid=0.485  
\# d3: keyword=0.0 semantic=0.0 hybrid=0.0  
\# Best hybrid match: d1  
\# Hybrid search fuses exact-term matching (keyword/BM25) with meaning (semantic) for robustness.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why combine keyword and semantic search?**

A: Each covers the other's weakness: keyword search nails exact terms/codes; semantic search captures meaning and paraphrases. Hybrid search gets both, improving recall and precision for mixed queries.

**Q: How are the two result sets combined?**

A: Commonly with Reciprocal Rank Fusion (RRF), which merges by rank, or a weighted score blend (an alpha balancing lexical vs semantic contributions).

**Q: When is hybrid search especially valuable?**

A: For queries mixing exact identifiers with conceptual terms (product codes plus descriptions), or domains with lots of names/codes where pure semantic search can miss literal matches.

## **46\. Agentic RAG**

**Simple Explanation**

Agentic RAG adds decision-making to retrieval. Instead of always retrieving once and answering (classic one-shot RAG), an agent reasons about retrieval: whether it's needed at all, how to reformulate a weak query, whether to retrieve multiple times, and which tools or sources to use — looping and self-correcting as needed.

This handles harder, multi-step questions: the agent can break a question into sub-queries, retrieve for each, combine results, or skip retrieval entirely for chit-chat. It treats retrieval as a tool the LLM calls, making RAG more flexible and robust at the cost of more LLM calls, latency, and complexity.

**Hinglish Explanation**

Agentic RAG retrieval mein decision-making add karta hai. Hamesha ek baar retrieve karke answer dene ke bajaye (classic one-shot RAG), ek agent retrieval ke baare mein reason karta hai: kya ye zaroori hai bhi, ek weak query kaise reformulate kare, kya kai baar retrieve kare, aur kaun se tools ya sources use kare — zaroorat par loop aur self-correct karke.

Ye harder, multi-step questions handle karta hai: agent ek question ko sub-queries mein todh sakta hai, har ek ke liye retrieve kar sakta hai, results combine kar sakta hai, ya chit-chat ke liye retrieval poora skip kar sakta hai. Ye retrieval ko ek tool ki tarah treat karta hai jise LLM call karta hai, RAG ko zyada flexible aur robust banakar, zyada LLM calls, latency, aur complexity ke trade-off par.

**Key Interview Points**

* Adds decision-making: whether, what, and how to retrieve.

* Can reformulate weak queries and retrieve multiple times.

* Breaks complex questions into sub-queries; can skip retrieval for chit-chat.

* Treats retrieval as a tool the LLM calls (and can combine tools).

* More flexible/robust, but costs more calls, latency, and complexity.

**Real-World Example**

Asked 'compare our refund and shipping policies', an agentic RAG issues two retrievals (one per policy), combines the results, and answers — whereas one-shot RAG with a single retrieval might pull only one policy and give an incomplete comparison.

**Code — Full & Runnable (Python)**

*Real LangChain tool-calling agent code (needs an API key). The Python-runnable demo below simulates an agent deciding to retrieve, reformulating, and retrying so the loop is verifiable here.*

\# Agentic RAG — an agent decides when/what to retrieve, can reformulate and use tools.  
from langchain\_openai import ChatOpenAI  
from langchain.agents import create\_tool\_calling\_agent, AgentExecutor  
from langchain\_core.tools import tool  
from langchain\_core.prompts import ChatPromptTemplate  
   
\# Wrap retrieval as a TOOL the agent can choose to call (maybe multiple times).  
@tool  
def search\_kb(query: str) \-\> str:  
    """Search the knowledge base for relevant context."""  
    docs \= retriever.invoke(query)            \# your vector retriever  
    return "\\n\\n".join(d.page\_content for d in docs)  
   
llm \= ChatOpenAI(model="gpt-4o-mini", temperature=0)  
prompt \= ChatPromptTemplate.from\_messages(\[  
    ("system", "Use search\_kb when you need facts. Reformulate and search again if results are weak."),  
    ("human", "{input}"), ("placeholder", "{agent\_scratchpad}"),  
\])  
agent \= create\_tool\_calling\_agent(llm, \[search\_kb\], prompt)  
executor \= AgentExecutor(agent=agent, tools=\[search\_kb\])  
   
\# Unlike basic RAG (retrieve once, then answer), agentic RAG can decide NOT to retrieve,  
\# retrieve several times with refined queries, combine sources, and self-correct.  
\# executor.invoke({"input": "How do I send an item back?"})

**Test / Demo & Expected Output (Python-runnable)**

\# Agentic RAG — an agent decides whether to retrieve, can reformulate and retry  
import math  
kb \= {  
    "shipping": "Free shipping on orders over $50.",  
    "returns":  "Returns accepted within 30 days.",  
}  
def retrieve(query):  
    q \= query.lower()  
    for key, text in kb.items():  
        if key in q: return text  
    return None     \# nothing relevant found  
   
def agentic\_rag(question, max\_steps=3):  
    trace \= \[\]  
    query \= question  
    for step in range(max\_steps):  
        trace.append(("Retrieve", query))  
        ctx \= retrieve(query)  
        if ctx:  
            trace.append(("Found", ctx))  
            trace.append(("Answer", ctx))  
            return trace  
        \# Reformulate: map intent to a better query term and retry (agentic decision).  
        if "send back" in query.lower():  
            trace.append(("Reformulate", "send back \-\> returns"))  
            query \= "returns policy"  
        else:  
            break  
    trace.append(("Answer", "I don't have that information."))  
    return trace  
   
for step, val in agentic\_rag("How do I send back an item?"):  
    print(f"{step:12}: {val}")  
trace \= agentic\_rag("How do I send back an item?")  
assert trace\[-1\]\[0\] \== "Answer" and "30 days" in trace\[-1\]\[1\]  
print("\\nAgentic RAG adds decisions: when to retrieve, how to reformulate, retry, or use tools.")  
print("Unlike basic RAG (always retrieve once), the agent loops and adapts until it can answer.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Retrieve    : How do I send back an item?  
\# Reformulate : send back \-\> returns  
\# Retrieve    : returns policy  
\# Found       : Returns accepted within 30 days.  
\# Answer      : Returns accepted within 30 days.  
\#   
\# Agentic RAG adds decisions: when to retrieve, how to reformulate, retry, or use tools.  
\# Unlike basic RAG (always retrieve once), the agent loops and adapts until it can answer.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: How is agentic RAG different from classic RAG?**

A: Classic RAG always retrieves once then answers. Agentic RAG reasons about retrieval — deciding whether to retrieve, reformulating queries, retrieving multiple times, and using tools — looping to handle complex, multi-step questions.

**Q: What problems does agentic RAG solve?**

A: Questions needing multiple lookups, query reformulation, or no retrieval at all. The agent can decompose, retry, and combine sources, improving robustness on hard queries.

**Q: What are the trade-offs?**

A: More LLM calls and tool steps mean higher latency, cost, and complexity, and more potential failure points — so it's used when the added flexibility is worth it over simpler one-shot RAG.

## **47\. RAG evaluation (RAGAS)**

**Simple Explanation**

RAG systems need objective evaluation, not just eyeballing. RAGAS is a framework that scores RAG quality across both retrieval and generation. Retrieval metrics include context precision (are retrieved chunks relevant?) and context recall (were all the needed chunks retrieved?). Generation metrics include faithfulness (is the answer grounded in the context, with no hallucination?) and answer relevancy (does it address the question?).

These scores let you compare configurations objectively — different chunking strategies, embedding models, k values, or rerankers — and improve the system systematically. Evaluation turns 'this looks good' into measurable progress, which is essential for trusting and iterating on a production RAG pipeline.

**Hinglish Explanation**

RAG systems ko objective evaluation chahiye, sirf eyeballing nahi. RAGAS ek framework hai jo RAG quality ko retrieval aur generation dono ke across score karta hai. Retrieval metrics mein context precision (kya retrieved chunks relevant hain?) aur context recall (kya saare zaroori chunks retrieve hue?) shamil hain. Generation metrics mein faithfulness (kya answer context mein grounded hai, bina hallucination?) aur answer relevancy (kya ye question address karta hai?) shamil hain.

Ye scores aapko configurations objectively compare karne dete hain — alag chunking strategies, embedding models, k values, ya rerankers — aur system ko systematically improve karne dete hain. Evaluation 'ye achha lag raha hai' ko measurable progress mein badal deta hai, jo ek production RAG pipeline par trust aur iterate karne ke liye essential hai.

**Key Interview Points**

* Evaluate RAG objectively across retrieval AND generation.

* Context precision: are retrieved chunks relevant?

* Context recall: were all needed chunks retrieved?

* Faithfulness: is the answer grounded (no hallucination)?

* Answer relevancy: does the answer address the question? Compare configs to improve.

**Real-World Example**

A team tweaking their RAG pipeline runs RAGAS to compare chunk sizes: the 500-char config scores higher on context precision and faithfulness than the 2000-char one, giving them data-driven justification to ship the smaller chunks instead of guessing.

**Code — Full & Runnable (Python)**

*Real RAGAS evaluation code. The Python-runnable demo below computes context precision/recall and faithfulness so the metrics are verifiable here.*

\# RAG evaluation (RAGAS) — measure retrieval and generation quality with metrics.  
from ragas import evaluate  
from ragas.metrics import (  
    context\_precision, context\_recall, faithfulness, answer\_relevancy,  
)  
from datasets import Dataset  
   
\# Build an evaluation dataset of question / retrieved-contexts / answer / ground-truth.  
data \= {  
    "question": \["What is the return window?"\],  
    "contexts": \[\["Returns are accepted within 30 days of purchase."\]\],  
    "answer": \["You can return items within 30 days."\],  
    "ground\_truth": \["The return window is 30 days."\],  
}  
dataset \= Dataset.from\_dict(data)  
   
result \= evaluate(dataset, metrics=\[  
    context\_precision,   \# are retrieved chunks relevant?  
    context\_recall,      \# did we retrieve all needed info?  
    faithfulness,        \# is the answer supported by the context (no hallucination)?  
    answer\_relevancy,    \# does the answer address the question?  
\])  
\# print(result)  \# \-\> per-metric scores you can track and tune against  
   
\# RAGAS turns "the RAG feels better" into numbers, so you can tune chunking, k,  
\# the embedding model, and prompts with real before/after measurements.

**Test / Demo & Expected Output (Python-runnable)**

\# RAG evaluation (RAGAS) — quantify retrieval & generation quality with core metrics  
\# Context Precision: fraction of retrieved chunks that are relevant.  
\# Context Recall: fraction of needed (ground-truth) info that was retrieved.  
\# Faithfulness: fraction of answer claims supported by the retrieved context.  
def context\_precision(retrieved\_relevant\_flags):  
    return round(sum(retrieved\_relevant\_flags) / len(retrieved\_relevant\_flags), 2\)  
def context\_recall(needed, retrieved):  
    return round(len(set(needed) & set(retrieved)) / len(set(needed)), 2\)  
def faithfulness(claims, supported\_flags):  
    return round(sum(supported\_flags) / len(claims), 2\)  
   
\# Example: 3 chunks retrieved, 2 relevant; needed 2 facts, both retrieved; 3 claims all supported.  
cp \= context\_precision(\[1, 1, 0\])  
cr \= context\_recall(needed=\["fact\_a", "fact\_b"\], retrieved=\["fact\_a", "fact\_b", "noise"\])  
fa \= faithfulness(claims=\["c1", "c2", "c3"\], supported\_flags=\[1, 1, 1\])  
print(f"Context Precision: {cp}")  
print(f"Context Recall:    {cr}")  
print(f"Faithfulness:      {fa}")  
assert cp \== 0.67 and cr \== 1.0 and fa \== 1.0  
print("RAGAS scores a RAG system on retrieval (precision/recall) and generation (faithfulness/relevancy).")  
print("It enables data-driven tuning of chunking, k, and prompts instead of guessing.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Context Precision: 0.67  
\# Context Recall:    1.0  
\# Faithfulness:      1.0  
\# RAGAS scores a RAG system on retrieval (precision/recall) and generation (faithfulness/relevancy).  
\# It enables data-driven tuning of chunking, k, and prompts instead of guessing.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why evaluate RAG with metrics instead of manual review?**

A: Manual review doesn't scale and isn't reproducible. Metrics like those in RAGAS give objective, comparable scores so you can systematically tune and prove improvements.

**Q: What's the difference between faithfulness and answer relevancy?**

A: Faithfulness measures whether the answer is grounded in the retrieved context (no hallucination). Answer relevancy measures whether the answer actually addresses the user's question.

**Q: What do context precision and recall tell you?**

A: They measure retrieval quality: precision is how many retrieved chunks are relevant; recall is how many of the relevant chunks were actually retrieved. Low scores point to retrieval (not generation) problems.

## **48\. LangChain basics**

**Simple Explanation**

LangChain is a framework for building LLM applications from standardized, composable components: prompt templates, chat models, output parsers, retrievers, memory, tools, and agents — plus integrations with many model providers and vector stores. It saves you from re-implementing the plumbing every LLM app needs.

Its core composition mechanism is LCEL (LangChain Expression Language), which uses the pipe operator to wire components into a runnable chain: prompt | model | parser. The same chain supports invoke, batch, stream, and async out of the box. LangChain's value is consistency and speed — a common vocabulary and ready-made building blocks for RAG, agents, and complex workflows.

**Hinglish Explanation**

LangChain LLM applications banane ke liye ek framework hai jo standardized, composable components se bani hai: prompt templates, chat models, output parsers, retrievers, memory, tools, aur agents — plus kai model providers aur vector stores ke saath integrations. Ye aapko har LLM app ki zaroori plumbing dobara implement karne se bachata hai.

Iska core composition mechanism LCEL (LangChain Expression Language) hai, jo pipe operator use karke components ko ek runnable chain mein wire karta hai: prompt | model | parser. Wahi chain invoke, batch, stream, aur async out of the box support karti hai. LangChain ki value consistency aur speed hai — ek common vocabulary aur ready-made building blocks RAG, agents, aur complex workflows ke liye.

**Key Interview Points**

* Framework of standardized, composable LLM building blocks.

* Components: prompts, models, parsers, retrievers, memory, tools, agents.

* Integrates with many providers and vector stores.

* LCEL pipe (|) composes components into runnable chains.

* Chains support invoke/batch/stream/async — consistency and speed.

**Real-World Example**

Instead of hand-coding prompt formatting, API calls, retries, and parsing, a developer wires prompt | model | parser with LangChain and swaps the model or adds a retriever by changing one line — building a RAG app far faster than from scratch.

**Code — Full & Runnable (Python)**

*Real LangChain (LCEL) code. The Python-runnable demo below composes prompt | model | parser with a pipe operator so the chaining mechanism is verifiable here.*

\# LangChain basics — compose prompts, models, and parsers with LCEL (the | operator).  
from langchain\_openai import ChatOpenAI  
from langchain\_core.prompts import ChatPromptTemplate  
from langchain\_core.output\_parsers import StrOutputParser  
   
prompt \= ChatPromptTemplate.from\_template("Explain {topic} to a beginner in 2 sentences.")  
model \= ChatOpenAI(model="gpt-4o-mini", temperature=0)  
parser \= StrOutputParser()  
   
\# LCEL pipes components into a single runnable chain: prompt \-\> model \-\> parser.  
chain \= prompt | model | parser  
   
\# answer \= chain.invoke({"topic": "RAG"})  
\# chain.stream(...) and chain.batch(\[...\]) also work out of the box.  
   
\# LangChain provides standardized, swappable building blocks \\u2014 prompts, chat models,  
\# output parsers, retrievers, memory, tools, agents \\u2014 so you can assemble LLM apps fast.

**Test / Demo & Expected Output (Python-runnable)**

\# LangChain basics — compose LLM apps from reusable components (here: the LCEL pipe idea)  
\# Core building blocks: prompts, models, parsers \\u2014 wired together into a runnable chain.  
class PromptTemplate:  
    def \_\_init\_\_(self, template): self.template \= template  
    def format(self, \*\*kw): return self.template.format(\*\*kw)  
   
class FakeLLM:  
    def invoke(self, text): return f"LLM answer to: {text}"  
   
class UpperParser:  
    def parse(self, text): return text.upper()  
   
class Chain:                      \# mimics prompt | llm | parser  
    def \_\_init\_\_(self, \*steps): self.steps \= steps  
    def invoke(self, inputs):  
        data \= inputs  
        for step in self.steps:  
            if isinstance(step, PromptTemplate): data \= step.format(\*\*data)  
            elif isinstance(step, FakeLLM):      data \= step.invoke(data)  
            elif isinstance(step, UpperParser):  data \= step.parse(data)  
        return data  
   
chain \= Chain(PromptTemplate("Explain {topic} simply."), FakeLLM(), UpperParser())  
result \= chain.invoke({"topic": "RAG"})  
print("Chain output:", result)  
assert result \== "LLM ANSWER TO: EXPLAIN RAG SIMPLY."  
print("LangChain provides standard components (prompts, models, parsers, retrievers, memory, tools).")  
print("LCEL wires them with the | operator into composable, swappable pipelines.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# Chain output: LLM ANSWER TO: EXPLAIN RAG SIMPLY.  
\# LangChain provides standard components (prompts, models, parsers, retrievers, memory, tools).  
\# LCEL wires them with the | operator into composable, swappable pipelines.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What is LangChain and why use it?**

A: A framework providing standardized, composable components (prompts, models, parsers, retrievers, memory, tools, agents) and integrations, so you build LLM apps faster with a common structure instead of reinventing the plumbing.

**Q: What is LCEL?**

A: LangChain Expression Language — the pipe-based syntax (prompt | model | parser) for composing components into a single runnable chain that supports invoke, batch, stream, and async.

**Q: Is LangChain required to build LLM apps?**

A: No — you can call provider SDKs directly. LangChain adds convenience, standard abstractions, and integrations; some teams prefer lighter or no frameworks for simplicity and control.

## **49\. Chains**

**Simple Explanation**

A chain links multiple steps so each step's output becomes the next step's input — turning single LLM calls into multi-stage workflows. A sequential chain might summarize text, then translate the summary, then format it; each stage builds on the last. Steps can be prompts, model calls, tools, parsers, or plain functions.

Chains make complex tasks manageable by decomposing them into focused pieces, each easier to build, test, and reason about. Beyond simple sequences, chains can branch and route based on input. In LangChain, you compose them with the pipe operator (LCEL), and the resulting chain behaves like a single callable.

**Hinglish Explanation**

Ek chain kai steps ko link karti hai taaki har step ka output agle step ka input ban jaaye — single LLM calls ko multi-stage workflows mein badalkar. Ek sequential chain text summarize kar sakti hai, phir summary translate, phir use format; har stage pichhle par build karti hai. Steps prompts, model calls, tools, parsers, ya plain functions ho sakte hain.

Chains complex tasks ko manageable banati hain unhe focused pieces mein todhkar, har ek build, test, aur reason karna aasaan. Simple sequences ke alawa, chains input ke aadhaar par branch aur route kar sakti hain. LangChain mein, aap unhe pipe operator (LCEL) se compose karte ho, aur resulting chain ek single callable ki tarah behave karti hai.

**Key Interview Points**

* Link steps so each output feeds the next — multi-stage workflows.

* Steps can be prompts, model calls, tools, parsers, or functions.

* Decompose complex tasks into focused, testable pieces.

* Can branch and route, not just run in sequence.

* Composed with the pipe (LCEL); the chain acts as one callable.

**Real-World Example**

A content pipeline chains three steps: extract key points from a transcript, summarize them into a paragraph, then rewrite the paragraph in a brand voice. Each LLM call is simple and testable, and the chain runs them in order to produce the final polished output.

**Code — Full & Runnable (Python)**

*Real LangChain sequential-chain code. The Python-runnable demo below pipes one step's output into the next so multi-step composition is verifiable here.*

\# Chains — connect multiple steps so each output feeds the next (LCEL).  
from langchain\_openai import ChatOpenAI  
from langchain\_core.prompts import ChatPromptTemplate  
from langchain\_core.output\_parsers import StrOutputParser  
   
llm \= ChatOpenAI(model="gpt-4o-mini")  
parser \= StrOutputParser()  
   
outline\_chain \= ChatPromptTemplate.from\_template("Create a 3-point outline on {topic}.") | llm | parser  
write\_chain   \= ChatPromptTemplate.from\_template("Write a short paragraph from this outline:\\n{outline}") | llm | parser  
   
\# Sequential composition: feed the first chain's output into the second.  
full\_chain \= {"outline": outline\_chain} | write\_chain  
\# article \= full\_chain.invoke({"topic": "vector databases"})  
   
\# Chains break a complex task into reliable stages (outline \-\> write \-\> edit).  
\# You can branch (RunnableParallel), route, and add retrieval/memory steps similarly.

**Test / Demo & Expected Output (Python-runnable)**

\# Chains — connect steps so each output feeds the next (incl. sequential chains)  
def make\_step(fn): return fn  
   
\# A simple sequential chain: outline \-\> draft \-\> shorten.  
def outline(topic): return f"Outline: intro, {topic} basics, summary"  
def draft(outline\_text): return f"Draft based on \[{outline\_text}\]"  
def shorten(draft\_text): return draft\_text.replace("Draft based on ", "Summary of ")  
   
def run\_chain(steps, initial):  
    data \= initial  
    history \= \[("input", initial)\]  
    for step in steps:  
        data \= step(data)  
        history.append((step.\_\_name\_\_, data))  
    return data, history  
   
result, history \= run\_chain(\[outline, draft, shorten\], "RAG")  
for name, val in history:  
    print(f"{name:8}: {val}")  
assert result.startswith("Summary of \[Outline: intro, RAG basics")  
print("\\nChains link multiple steps/LLM calls; each step's output is the next step's input.")  
print("Sequential chains break complex tasks into reliable stages (e.g., outline then write then edit).")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# input   : RAG  
\# outline : Outline: intro, RAG basics, summary  
\# draft   : Draft based on \[Outline: intro, RAG basics, summary\]  
\# shorten : Summary of \[Outline: intro, RAG basics, summary\]  
\#   
\# Chains link multiple steps/LLM calls; each step's output is the next step's input.  
\# Sequential chains break complex tasks into reliable stages (e.g., outline then write then edit).  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: What is a chain?**

A: A composition of steps where each step's output is the next step's input, turning multiple LLM/tool calls into a coherent multi-stage workflow.

**Q: Why break a task into a chain instead of one big prompt?**

A: Smaller, focused steps are easier to build, test, debug, and reason about, and often more reliable than asking the model to do everything in a single complex prompt.

**Q: Can chains do more than run steps in sequence?**

A: Yes — they can branch and route based on inputs or intermediate results, enabling conditional and more complex workflows beyond a simple linear sequence.

## **50\. Prompt Templates**

**Simple Explanation**

Prompt templates separate the fixed wording of a prompt from its variable parts, defining placeholders that get filled with inputs at runtime. This makes prompts reusable, consistent, and testable — you write the structure once and supply different values (role, language, question) each call instead of building strings by hand.

Chat templates additionally structure system/user/assistant roles and can embed few-shot examples and format instructions. Partials let you pre-fill common variables so callers only provide what changes. In LangChain, templates plug directly into chains via the pipe, forming the first stage of most LLM pipelines.

**Hinglish Explanation**

Prompt templates ek prompt ke fixed wording ko uske variable parts se alag karte hain, placeholders define karke jo runtime par inputs se bharte hain. Ye prompts ko reusable, consistent, aur testable banata hai — aap structure ek baar likhte ho aur har call par alag values (role, language, question) dete ho, haath se strings banane ke bajaye.

Chat templates additionally system/user/assistant roles structure karte hain aur few-shot examples aur format instructions embed kar sakte hain. Partials aapko common variables pre-fill karne dete hain taaki callers sirf wo de jo badalta hai. LangChain mein, templates pipe ke through seedhe chains mein plug hote hain, zyada LLM pipelines ka pehla stage banakar.

**Key Interview Points**

* Separate fixed wording from variables via placeholders.

* Make prompts reusable, consistent, and testable.

* Chat templates structure roles and embed few-shot examples/format instructions.

* Partials pre-fill common variables; callers supply only what changes.

* Plug into chains via the pipe — the first stage of most pipelines.

**Real-World Example**

A multi-feature app defines one chat template with role/language/question variables. The tutoring feature partials in role='tutor', language='English'; the legal feature partials in role='lawyer' — reusing the same tested structure while only the question changes per request.

**Code — Full & Runnable (Python)**

*Real LangChain PromptTemplate / ChatPromptTemplate code. The Python-runnable demo below formats templates with variables and partials so reuse is verifiable here.*

\# Prompt Templates — reusable, parameterized prompts (with partials and roles).  
from langchain\_core.prompts import ChatPromptTemplate, PromptTemplate  
   
\# Simple string template with variables:  
simple \= PromptTemplate.from\_template("Translate to {language}: {text}")  
\# simple.format(language="French", text="Hello")  
   
\# Chat template with roles (system \+ human), plus a partial to lock stable fields:  
chat \= ChatPromptTemplate.from\_messages(\[  
    ("system", "You are a {role} who answers in {language}."),  
    ("human", "{question}"),  
\])  
support \= chat.partial(role="support agent", language="English")  \# fix once, reuse  
\# messages \= support.format\_messages(question="How do I reset my password?")  
   
\# Templates separate fixed instructions from variable inputs \\u2014 reusable, consistent,  
\# and testable. Partials pre-fill values so each call only supplies what changes.

**Test / Demo & Expected Output (Python-runnable)**

\# Prompt Templates — parameterized, reusable prompts with variables (and partials)  
class PromptTemplate:  
    def \_\_init\_\_(self, template, partials=None):  
        self.template \= template  
        self.partials \= partials or {}  
    def partial(self, \*\*kw):  
        return PromptTemplate(self.template, {\*\*self.partials, \*\*kw})  
    def format(self, \*\*kw):  
        return self.template.format(\*\*{\*\*self.partials, \*\*kw})  
   
tmpl \= PromptTemplate("You are a {role}. Answer in {language}.\\nQuestion: {question}")  
\# Pre-fill (partial) the stable fields once, then reuse for many questions.  
support \= tmpl.partial(role="support agent", language="English")  
p1 \= support.format(question="How do I reset my password?")  
p2 \= support.format(question="Where are my orders?")  
print(p1)  
print("---")  
print(p2)  
assert "support agent" in p1 and "reset my password" in p1  
assert "Where are my orders" in p2 and "support agent" in p2  
print("\\nPrompt templates separate fixed instructions from variable inputs \\u2014 reusable and consistent.")  
print("Partials lock in stable values (role, format) so each call only supplies what changes.")  
print("All assertions passed.")  
   
\# \===== EXPECTED OUTPUT \=====  
\# You are a support agent. Answer in English.  
\# Question: How do I reset my password?  
\# \---  
\# You are a support agent. Answer in English.  
\# Question: Where are my orders?  
\#   
\# Prompt templates separate fixed instructions from variable inputs — reusable and consistent.  
\# Partials lock in stable values (role, format) so each call only supplies what changes.  
\# All assertions passed.  
\# \===== END EXPECTED OUTPUT \=====

**Common Follow-up Questions**

**Q: Why use prompt templates instead of string formatting?**

A: They make prompts reusable, consistent, and testable by separating fixed structure from variables, and they integrate with chains and parsers — cleaner and less error-prone than hand-built strings.

**Q: What are partials in prompt templates?**

A: Pre-filled variables that lock in common values (e.g., role and language) so callers only supply the parts that change (like the question), simplifying reuse.

**Q: What's special about chat prompt templates?**

A: They structure messages by role (system/user/assistant) and can include few-shot examples and format instructions, producing the message list chat models expect rather than a single string.