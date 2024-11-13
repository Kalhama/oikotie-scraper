import psycopg
from psycopg_pool import ConnectionPool
import os
from contextlib import contextmanager

# Global variable for the connection pool
_pool = None

def init_db_pool(min_size: int = 1, max_size: int = 10):
    """
    Initialize the connection pool.

    :param min_size: Minimum number of connections in the pool.
    :param max_size: Maximum number of connections in the pool.
    """
    global _pool
    if _pool is None:
        _pool = ConnectionPool(
            conninfo=os.getenv("DB"),
            min_size=min_size,
            max_size=max_size
        )
        print("Connection pool initialized")

@contextmanager
def get_db_connection():
    """
    Get a connection from the pool and ensure it's returned to the pool.
    
    :return: A connection object from the pool.
    """
    if _pool is None:
        raise Exception("Connection pool is not initialized. Call init_db_pool first.")
    
    conn = _pool.getconn()  # Fetch a connection from the pool
    try:
        yield conn  # Yield the connection object to be used in the `with` block
    finally:
        _pool.putconn(conn)  # Return the connection to the pool

def close_db_pool():
    """
    Close the connection pool and release all connections.
    """
    global _pool
    if _pool is not None:
        _pool.close()
        print("Connection pool closed")
        _pool = None

# Example of environment-based initialization
if __name__ == "__main__":
    init_db_pool()