"""Baseline the existing LogiAI schema without dropping or altering data.

Existing deployments created by Kysely already have these tables. create_all(checkfirst=True)
creates missing tables only; it does not modify existing tables.
"""
from alembic import op
from app.db.tables import metadata

revision = "0001_baseline"
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    metadata.create_all(bind=op.get_bind(), checkfirst=True)

def downgrade() -> None:
    # Intentionally non-destructive: this baseline may be applied to a database
    # containing user data created before Alembic was introduced.
    pass
