from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib.colors import black, HexColor

def render_plan_pdf(path, name, goal, plan, gap_map, timeline):
    c = canvas.Canvas(path, pagesize=A4)
    w, h = A4
    y = h - 2*cm

    c.setFillColor(black)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(2*cm, y, f"Upskill Plan – {name}")
    y -= 1.0*cm
    c.setFont("Helvetica", 12)
    c.drawString(2*cm, y, f"Goal Role: {goal}")
    y -= 1.0*cm

    c.setFont("Helvetica-Bold", 13); c.drawString(2*cm, y, "Plan (3 courses)")
    y -= 0.7*cm
    c.setFont("Helvetica", 11)
    for i, item in enumerate(plan, 1):
        c.drawString(2*cm, y, f"{i}. {item['course_id']} – {item['why']}")
        y -= 0.6*cm

    y -= 0.4*cm
    c.setFont("Helvetica-Bold", 13); c.drawString(2*cm, y, "Gap Map (delta)")
    y -= 0.7*cm
    c.setFont("Helvetica", 11)
    for k, v in gap_map.items():
        c.drawString(2*cm, y, f"{k}: {v}")
        y -= 0.5*cm

    y -= 0.4*cm
    c.setFont("Helvetica-Bold", 13); c.drawString(2*cm, y, "Timeline")
    y -= 0.7*cm
    c.setFont("Helvetica", 11)
    c.drawString(2*cm, y, f"Total weeks: {timeline['weeks']}")
    y -= 0.5*cm
    for cid, s, e in timeline['sequence']:
        c.drawString(2*cm, y, f"{cid}: weeks {s}-{e}")
        y -= 0.5*cm

    c.showPage(); c.save()
