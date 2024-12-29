import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import User from '../models/User';
import Bill from '../models/Bill';
import Product from '../models/Product';


const createBill = async (req: any, res: any) => {
  const { userId, amount, products } = req.body;
  let TotalAmount = amount;
  TotalAmount += TotalAmount * 0.18;
  const GST = TotalAmount * 0.18;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const bill = new Bill({
      userId,
      amount,
      createdAt: new Date(),
    });
    await bill.save();
    const bill_Id = bill._id;

    const productPromises = products.map((product: any) => {
      const productData = new Product({
        name: product.name,
        price: product.price,
        Bill_Id: bill_Id,
        quantity: product.quantity,
      });
      return productData.save();
    });
    await Promise.all(productPromises);

    let template = fs.readFileSync(path.join(__dirname, './Bill.html'), 'utf8');
    const itemsHtml = products
      .map(
        (product: any) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>₹${product.price}</td>
            <td>₹${product.price * product.quantity}</td>
          </tr>`
      )
      .join('');
    const grandTotal = products.reduce(
      (total: any, product: any) => total + product.price * product.quantity,
      0
    );

    template = template
      .replace('{{date}}', new Date().toLocaleDateString())
      .replace('{{customerName}}', user.name)
      .replace('{{email}}', user.email)
      .replace('{{items}}', itemsHtml)
      .replace('{{grandTotal}}', TotalAmount.toString())
      .replace('{{GST}}', GST.toString())
      .replace('{{Total}}', grandTotal.toString());

    // Launch puppeteer to generate PDF from the HTML template
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    
    const filePath = path.join(__dirname, '../pdfs', `bill_${bill_Id}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="invoice.pdf"',
    });
    fs.createReadStream(filePath).pipe(res);
    
  } catch (error: any) {
    console.error('Error creating bill:', error);
    res.status(500).send({ message: 'Error creating bill', error: error.message });
  }
};


export default { createBill };
