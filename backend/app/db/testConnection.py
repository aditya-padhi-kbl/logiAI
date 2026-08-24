import asyncio

from session import engine
from sqlalchemy import text


async def test():
    async with engine.connect() as conn:
        result = await conn.execute(text("select 1"))
        print(result.scalar())


if __name__ == "__main__":
    asyncio.run(test())
