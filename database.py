from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "postgresql://root:QzU64pKgCD4jf0LIalFNt1Am9yQrTInq@dpg-d8assjjbc2fs73e5jh00-a.oregon-postgres.render.com:5432/render_seaa?sslmode=require"

engine = create_engine(
    db_url,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

session = SessionLocal