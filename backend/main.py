from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    """
    Parse pipeline and return:
    - num_nodes: count of nodes
    - num_edges: count of edges  
    - is_dag: whether pipeline is a Directed Acyclic Graph
    """
    
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    
    is_dag = check_is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }

def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph is a Directed Acyclic Graph (DAG)
    Uses DFS with recursion stack to detect cycles
    """
    
    graph = {node.id: [] for node in nodes}
    for edge in edges:
        graph[edge.source].append(edge.target)
    
    visited = set()
    rec_stack = set()
    
    def has_cycle(node_id: str) -> bool:
        """DFS to detect cycle"""
        visited.add(node_id)
        rec_stack.add(node_id)
        
        for neighbor in graph.get(node_id, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        
        rec_stack.remove(node_id)
        return False
    
    for node in nodes:
        if node.id not in visited:
            if has_cycle(node.id):
                return False 
    
    return True  
