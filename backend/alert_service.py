from sqlalchemy.orm import Session
import models

def check_and_alert(transaction: models.Transaction, db: Session):
    """
    Checks if the transaction breaches any user-defined thresholds.
    Triggers an alert if a breach is detected.
    """
    # Fetch thresholds for the user
    # We check:
    # 1. Global Transaction Limit (category="ALL", window="TRANSACTION")
    # 2. Category Transaction Limit (category=transaction.category, window="TRANSACTION")

    # Note: Monthly limits would require aggregating past transactions.
    # For this iteration, we focus on Single Transaction limits as requested by "breaches thresholds" on creation.

    thresholds = db.query(models.AlertThreshold).filter(
        models.AlertThreshold.user_id == transaction.user_id,
        models.AlertThreshold.window == "TRANSACTION"
    ).all()

    alerts_triggered = []

    for threshold in thresholds:
        is_breach = False
        if threshold.category == "ALL":
            if transaction.amount > threshold.amount_limit:
                is_breach = True
        elif threshold.category == transaction.category:
            if transaction.amount > threshold.amount_limit:
                is_breach = True

        if is_breach:
            alert_msg = f"ALERT: Transaction '{transaction.description}' of ${transaction.amount} exceeded {threshold.category} limit of ${threshold.amount_limit}."
            alerts_triggered.append(alert_msg)
            send_alert(transaction.user_id, alert_msg)

    return alerts_triggered

import logging
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_alert(user_id: int, message: str):
    """
    Simulates sending an alert via Twilio/Email.
    In a real app, we would look up the user's email/phone using user_id.
    """
    incident_id = str(uuid.uuid4())[:8]
    print(f"\n[!!! INCIDENT RESPONSE TRIGGERED !!!]")
    print(f"To User ID {user_id}: {message}")

    # Simulating external notification delivery
    logger.info(f"[MOCK TWILIO]: Dispatching SMS to user for Incident #{incident_id}")

    print(f"[!!! END ALERT !!!]\n")
