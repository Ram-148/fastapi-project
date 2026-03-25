from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
db_url = "postgresql://postgres:Rpsp1482006%40@localhost:5432/telusko"
engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# For compatibility with code that expects a callable named `session`
# (e.g. `from database import session`)
session = SessionLocal