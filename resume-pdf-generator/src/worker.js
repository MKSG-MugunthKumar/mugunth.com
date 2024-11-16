// src/worker.js
import { Puppeteer } from '@cloudflare/puppeteer';

export default {
  async fetch(request, env, ctx) {
    // Only handle requests for resume.pdf
    if (!request.url.endsWith('/resume.pdf')) {
      return new Response('Not Found', { status: 404 });
    }

    const cacheKey = 'resume-pdf';
    const cache = caches.default;

    // Try to get PDF from cache first
    let response = await cache.match(request);
    if (response) {
      return response;
    }

    // Generate new PDF if not in cache
    try {
      const browser = await Puppeteer.launch();
      const page = await browser.newPage();

      // Load the resume page
      await page.goto(`${env.SITE_URL}/resume`, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        printBackground: true
      });

      await browser.close();

      // Create response with appropriate headers
      response = new Response(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="resume.pdf"',
          'Cache-Control': 'public, max-age=3600',
        },
      });

      // Cache the response
      ctx.waitUntil(cache.put(request, response.clone()));

      return response;
    } catch (error) {
      return new Response(`Failed to generate PDF: ${error.message}`, {
        status: 500
      });
    }
  },

  // Optional: Add scheduled task to regenerate PDF periodically
  async scheduled(event, env, ctx) {
    try {
      const url = `${env.SITE_URL}/resume.pdf`;
      await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
    } catch (error) {
      console.error('Failed to regenerate PDF:', error);
    }
  }
};
