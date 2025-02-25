"""Renaming the Task table to Activity

Revision ID: f91c39ca4f32
Revises: 10ec9562f6b3
Create Date: 2025-02-24 23:15:31.524837

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f91c39ca4f32'
down_revision: Union[str, None] = '10ec9562f6b3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
