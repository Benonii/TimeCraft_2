"""Changing the Basemodel class

Revision ID: 10ec9562f6b3
Revises: 6e5ab13242e1
Create Date: 2025-02-24 14:56:13.959251

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '10ec9562f6b3'
down_revision: Union[str, None] = '6e5ab13242e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
