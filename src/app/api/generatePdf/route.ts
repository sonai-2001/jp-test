// import { NextRequest, NextResponse } from 'next/server';
// import puppeteer from 'puppeteer';

// export async function POST(request: NextRequest) {
//   try {
//     const { htmlContent } = await request.json();

//     if (!htmlContent) {
//       return NextResponse.json({ error: 'htmlContent is required' }, { status: 400 });
//     }

//     // Launch Puppeteer
//     const browser = await puppeteer.launch({
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });
//     const page = await browser.newPage();

//     // Set HTML content
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

//     // Generate PDF buffer
//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       printBackground: true,
//       landscape: true,
//     });

//     await browser.close();

//     // Return PDF as a streamed response
//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'attachment; filename=invoice.pdf',
//       },
//     });
//   } catch (error) {
//     console.error('PDF generation error:', error);
//     return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { htmlContent } = await request.json();
    if (!htmlContent) {
      return NextResponse.json({ error: 'htmlContent is required' }, { status: 400 });
    }

    const isProd = process.env.NODE_ENV === 'production';

    // Use puppeteer-core in prod (Docker), puppeteer in dev (local)
    const puppeteer = isProd
      ? (await import('puppeteer-core')).default
      : (await import('puppeteer')).default;

    // In production, use Chromium installed via apk add in Dockerfile
    // In dev, Puppeteer knows its own executablePath
    const executablePath = isProd
      ? process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
      : puppeteer.executablePath();

    const launchOptions = {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath,
      headless: true,
    };

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { margin: 0; font-family: Arial, sans-serif; }
            table { border-collapse: collapse; }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    // Convert Uint8Array to Buffer for NextResponse
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=invoice.pdf',
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}