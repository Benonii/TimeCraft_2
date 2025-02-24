"""Updating the profile table

Revision ID: 6e5ab13242e1
Revises: 543703d68501
Create Date: 2025-02-24 14:46:41.010644

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6e5ab13242e1'
down_revision: Union[str, None] = '543703d68501'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
