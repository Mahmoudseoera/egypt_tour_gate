<?xml version="1.0" encoding="UTF-8"?>
<!--
  public/sitemap.xsl
  Drop this file in your /public folder.
  All sitemaps reference it via:  <?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
-->
<xsl:stylesheet
  version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="sitemap xhtml">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>XML Sitemap — Egypt Tours Gate</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f4f6f9;
            color: #333;
            min-height: 100vh;
          }

          /* ── Header ── */
          header {
            background: linear-gradient(135deg, #272262 0%, #1a1850 100%);
            color: #fff;
            padding: 28px 40px;
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 0 4px 20px rgba(39,34,98,.35);
          }
          header .logo-icon {
            width: 48px; height: 48px;
            background: #e3b75e;
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 22px; font-weight: 900; color: #272262;
            flex-shrink: 0;
          }
          header h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
          header p  { font-size: 13px; color: rgba(255,255,255,.65); margin-top: 2px; }
          header .badge {
            margin-left: auto;
            background: rgba(227,183,94,.18);
            border: 1px solid rgba(227,183,94,.4);
            color: #e3b75e;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          /* ── Stats bar ── */
          .stats {
            background: #fff;
            border-bottom: 1px solid #e8eaf0;
            padding: 14px 40px;
            display: flex;
            align-items: center;
            gap: 32px;
            font-size: 13px;
            color: #666;
          }
          .stats strong { color: #272262; font-size: 18px; font-weight: 700; }
          .stats .dot { width: 5px; height: 5px; border-radius: 50%; background: #ddd; }

          /* ── Main container ── */
          main { max-width: 1100px; margin: 32px auto; padding: 0 24px 60px; }

          /* ── Table ── */
          .table-wrap {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 16px rgba(39,34,98,.08);
            overflow: hidden;
          }
          table { width: 100%; border-collapse: collapse; }
          thead tr {
            background: #272262;
            color: #fff;
          }
          thead th {
            padding: 14px 20px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .6px;
            text-transform: uppercase;
            white-space: nowrap;
          }
          tbody tr {
            border-bottom: 1px solid #f0f2f7;
            transition: background .15s;
          }
          tbody tr:last-child { border-bottom: none; }
          tbody tr:hover { background: #f9f8ff; }
          tbody td {
            padding: 13px 20px;
            font-size: 13.5px;
            vertical-align: middle;
          }

          /* URL cell */
          .url-cell a {
            color: #272262;
            text-decoration: none;
            font-weight: 500;
            word-break: break-all;
            transition: color .15s;
          }
          .url-cell a:hover { color: #e3b75e; text-decoration: underline; }

          /* Priority pill */
          .pill {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11.5px;
            font-weight: 700;
          }
          .pill-high   { background: #e8f5e9; color: #2e7d32; }
          .pill-mid    { background: #fff8e1; color: #f57f17; }
          .pill-low    { background: #fce4ec; color: #c62828; }

          /* Changefreq badge */
          .freq {
            font-size: 11px;
            color: #888;
            background: #f4f6f9;
            padding: 2px 8px;
            border-radius: 6px;
            font-weight: 500;
          }

          /* Lastmod */
          .date { color: #888; font-size: 12.5px; }

          /* ── Footer ── */
          footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #aaa;
          }
          footer a { color: #e3b75e; text-decoration: none; }

          @media (max-width: 680px) {
            header { padding: 20px; flex-wrap: wrap; }
            .stats { padding: 12px 20px; gap: 16px; flex-wrap: wrap; }
            main  { padding: 0 12px 40px; margin-top: 20px; }
            thead th:nth-child(3),
            thead th:nth-child(4),
            tbody td:nth-child(3),
            tbody td:nth-child(4) { display: none; }
          }
        </style>
      </head>
      <body>

        <header>
          <div class="logo-icon">E</div>
          <div>
            <h1>XML Sitemap</h1>
            <p>Egypt Tours Gate — Search Engine Index</p>
          </div>
          <span class="badge">&#x2713; Valid Sitemap</span>
        </header>

        <div class="stats">
          <div>
            <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong>
            <span style="margin-left:6px">URLs indexed</span>
          </div>
          <div class="dot"/>
          <div>Generated for search engine crawlers</div>
          <div class="dot"/>
          <div>
            <a href="https://www.sitemaps.org" style="color:#272262;text-decoration:none;font-weight:600">
              sitemaps.org protocol
            </a>
          </div>
        </div>

        <main>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>URL</th>
                  <th>Last Modified</th>
                  <th>Change Freq</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <xsl:sort select="sitemap:priority" order="descending" data-type="number"/>
                  <tr>
                    <td style="color:#bbb;font-size:12px;width:44px">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td class="url-cell">
                      <a href="{sitemap:loc}" target="_blank" rel="noopener">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="date">
                      <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                    </td>
                    <td>
                      <span class="freq">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="sitemap:priority &gt;= 0.8">
                          <span class="pill pill-high"><xsl:value-of select="sitemap:priority"/></span>
                        </xsl:when>
                        <xsl:when test="sitemap:priority &gt;= 0.6">
                          <span class="pill pill-mid"><xsl:value-of select="sitemap:priority"/></span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="pill pill-low"><xsl:value-of select="sitemap:priority"/></span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <p>
              Generated by <a href="https://www.egypttoursgate.com">egypttoursgate.com</a>
              &#160;·&#160;
              <a href="https://www.sitemaps.org/protocol.html">Sitemap Protocol</a>
            </p>
          </footer>
        </main>

      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
