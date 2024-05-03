import React from 'react';
import { Typography, Link, Card, CardContent, Table, Container, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'left',
}));

const Title = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md">
      <div className="MarkdownPage_markdownPage__FKTlV Datenschutz_datenschutzContainer__pn9u5 container-fluid">
        <CustomCard>
          <CardContent>
            <Title variant="h5" component="p">
              Datenschutzinformation llm-insight-expert
            </Title>
          </CardContent>
        </CustomCard>

        {/* Section 1: Geltungsbereich */}
        <CustomCard>
          <CardContent>
            <Typography variant="h6" component="p">
              1. Geltungsbereich
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Diese Datenschutzinformation gilt für Datenverarbeitungen auf <Link href="http://www.sustain.ki.nrw/">www.sustain.ki.nrw</Link>, sowie aller im Zusammenhang angebotenen Diensten als Webdienst oder als mobile App (zur besseren Lesbarkeit im Folgenden: Webseite), sofern jeweils auf diese Datenschutzinformation verwiesen wird.
            </Typography>
          </CardContent>
        </CustomCard>

        {/* Section 2: Verantwortliche */}
        <CustomCard>
          <CardContent>
            <Typography variant="h6" component="p">
              2. Name und Kontaktdaten des für die Verarbeitung Verantwortlichen sowie des betrieblichen Datenschutzbeauftragten
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              <strong>Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.</strong> <br />
              Hansastraße 27 c, 80686 München <br />
              für ihr Fraunhofer-Institut für Intelligente Analyse- und Informationssysteme IAIS, Schloss Birlinghoven, 53757 Sankt Augustin (im Folgenden »Fraunhofer-IAIS«) <br />
              E-Mail: <Link href="mailto:info@iais.fraunhofer.de">info@iais.fraunhofer.de</Link> <br />
              Telefon: +49 2241 14-2252 <br />
              Fax: +49 2241 14-2436
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Der Datenschutzbeauftragte von Fraunhofer ist unter der o.g. Anschrift, zu Hd. Datenschutzbeauftragter bzw. unter <Link href="mailto:datenschutz@zv.fraunhofer.de">datenschutz@zv.fraunhofer.de</Link> erreichbar.
            </Typography>
            <Typography variant="body2" component="p">
              Sie können sich jederzeit bei Fragen zum Datenschutzrecht oder Ihren Betroffenenrechten direkt an unseren Datenschutzbeauftragten wenden.
            </Typography>
          </CardContent>
        </CustomCard>

        {/* Section 3: Verarbeitung personenbezogener Daten */}
        {/* Subsection a) */}
        <CustomCard>
          <CardContent>
            <Typography variant="h6" component="p">
              3. Verarbeitung personenbezogener Daten und Zwecke der Verarbeitung
            </Typography>
            <Typography variant="subtitle1" component="p">
              a) Beim Besuch der Webseite
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Sie können unsere Webseite aufrufen, ohne Angaben zu Ihrer Identität preisgeben zu müssen. Der auf Ihrem Endgerät eingesetzte Browser sendet lediglich automatisch Informationen an den Server unserer Webseite (z.B. Browsertyp und –version, Datum und Uhrzeit des Zugriffs), um einen Verbindungsaufbau der Webseite zu ermöglichen. Hierzu gehört auch die IP-Adresse Ihres anfragenden Endgerätes. Diese wird temporär in einem sogenannten Logfile gespeichert und nach 7 Tagen gelöscht.
            </Typography>
            {/* And so on for the rest of the subsections */}
          </CardContent>
        </CustomCard>

        {/* Sections 4, 5, 6, 7, 8 */}
        {/* Follow similar structure as above for each section */}

        <CustomCard>
          <CardContent>
            <Typography variant="h6" component="p">
              4. Weitergabe von Daten
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Sofern wir personenbezogene Daten, die wir über die Webseite erheben, an Auftragsverarbeiter weitergeben, informieren wir Sie darüber in dieser Datenschutzinformation bei dem jeweiligen Datenverarbeitungsvorgang unter Nennung des konkreten Empfängers.
            </Typography>
            <Typography variant="body2" component="p">
              Im Übrigen geben wir Ihre personenbezogenen Daten nur weiter, wenn
            </Typography>
            <ul>
              <li>Sie gem. Art. 6 Abs. 1 S. 1 lit. a DSGVO Ihre ausdrückliche Einwilligung dazu erteilt haben;</li>
              <li>dies gem. Art. 6 Abs. 1 S. 1 lit. b DSGVO für die Erfüllung eines Vertrages mit Ihnen erforderlich ist (zum Beispiel bei Weitergabe an Versandunternehmen zum Zwecke der Lieferung der von Ihnen bestellten Ware oder bei Weitergabe von Zahlungsdaten an Zahlungsdienstleister bzw. Kreditinstitute, um einen Zahlungsvorgang durchzuführen);</li>
              <li>für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht.</li>
            </ul>
            <Typography variant="body2" component="p">
              Die weitergegebenen Daten dürfen von den Empfängern ausschließlich zu den genannten Zwecken verwendet werden.
            </Typography>
          </CardContent>
        </CustomCard>
        <CustomCard>
          <CardContent>
            <Typography variant="h6" component="p">
              5. Cookies
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              <strong>a) Allgemeines</strong>
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Wir setzen auf unserer Seite Cookies ein. Bei Cookies handelt es sich um kleine Dateien, die Ihr Browser automatisch erstellt und die auf Ihrem Endgerät (Laptop, Tablet, Smartphone o.ä.) gespeichert werden, wenn Sie unsere Seite besuchen. Cookies richten auf Ihrem Endgerät keinen Schaden an, enthalten keine Viren, Trojaner oder sonstige Schadsoftware.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              In dem Cookie werden Informationen abgelegt, die sich jeweils im Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben. Dies bedeutet jedoch nicht, dass wir dadurch unmittelbar Kenntnis von Ihrer Identität erhalten.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Cookies, die nicht unbedingt technisch notwendig sind, um einen von Ihnen ausdrücklich gewünschten Webdienst nutzen zu können, werden erst nach Ihrer Einwilligung gesetzt. Diese Einwilligung können Sie über den beim Besuch der Website angezeigten Cookie-Banner erteilen. Sie ist dann Rechtsgrundlage für die Speicherung und den Zugriff auf die Inhalte der Cookies (§ 15 Abs. 3 TMG i.V.m. Art. 5 Abs. 3 S. 1 RL 2002/58/EG).
            </Typography>
            <Typography variant="body2" component="p">
              <strong>b) Notwendige Cookies</strong>
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Die Verarbeitung personenbezogener Daten im Rahmen technisch notwendiger Cookies beruht auf unserem berechtigten Interesse an der Erbringung unserer, von Ihnen ausdrücklich gewünschten Webdienste.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              So setzen wir z.B. sogenannte Session-Cookies ein, um eine Sitzungssteuerung zu ermöglichen oder um Formulareingaben oder Warenkörbe während der Sitzung zu speichern. Session-Cookies werden spätestens mit dem Schließen Ihres Webbrowsers gelöscht.
            </Typography>
            <Typography variant="body2" component="p">
              <strong>c) Widerrufsrecht</strong>
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Sie haben jederzeit die Möglichkeit ihre Einwilligung für die Speicherung und den Zugriff auf die Inhalte der Cookies mit Wirkung für die Zukunft gem. Art. 7 Abs. 3 DSGVO zu widerrufen oder der Nutzung von nicht technisch notwendigen Cookies insgesamt oder teilweise zu widersprechen.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Sofern Sie ihre Einwilligung widerrufen oder der Nutzung widersprechen, wird von uns ein Cookie gesetzt (Opt-Out-Cookie), das Ihre Entscheidung dokumentiert und es uns ermöglicht diese umzusetzen. Der Opt-Out-Cookie gilt nur in diesem Browser und nur für unsere Webseite und wird auf Ihrem Gerät abgelegt. Löschen Sie die Cookies in diesem Browser, müssen Sie das Opt-Out-Cookie erneut setzen.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Die meisten Browser akzeptieren Cookies automatisch. Sie können Ihren Browser jedoch so konfigurieren, dass keine Cookies auf Ihrem Computer gespeichert werden oder stets ein Hinweis erscheint, bevor ein neues Cookie angelegt wird. Die vollständige Deaktivierung von Cookies kann jedoch dazu führen, dass Sie nicht alle Funktionen unserer Website nutzen können.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Ihr Widerruf hat keine Auswirkungen auf die Rechtmäßigkeit der von uns vorgenommenen Verarbeitungstätigkeiten, die auf unserem berechtigten Interesse (Art. 6 Abs. 1 S. 1 lit. f) DSGVO) beruhen.
            </Typography>
            <Typography variant="body2" component="p">
              <strong>d) YouTube</strong>
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Wir binden Komponenten (Videos) des Videoportals »YouTube« des Unternehmens Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland (Im Folgenden: »Google«) auf unseren Internetseiten ein. Die Implementierung erfolgt aufgrund von Art. 6 Abs. 1 S. 1 lit. f DSGVO, wobei unser Interesse in der reibungslosen Integration der Videos und der damit ansprechenden Gestaltung unserer Webseite liegt.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Die Einbindung erfolgt mittels einer Lösung, die verhindert, dass bereits eine Verbindung zu Google aufgebaut wird, nur weil Sie eine Seite mit einem implementierten Video aufrufen, ohne das Video zu aktivieren. Das bedeutet, dass erst dann Informationen an Google übermittelt werden, wenn Sie das Video zum Ansehen anklicken.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Teilweise werden Informationen an die Muttergesellschaft Google Inc. mit Sitz in den USA, an andere Google-Unternehmen und an externe Partner von Google übermittelt, die sich jeweils außerhalb der Europäischen Union befinden können. Google verwendet dafür von der Europäischen Kommission genehmigte Standardvertragsklauseln und verlässt sich auf die von der Europäischen Kommission erlassenen Angemessenheitsbeschlüsse bezüglich bestimmter Länder.
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Weitere Informationen zum Datenschutz im Zusammenhang mit YouTube finden Sie in den Datenschutzbestimmungen von Google.
            </Typography>
          </CardContent>
        </CustomCard>

        <CustomCard>
          <CardContent>
            <Typography variant="h6" component="p">
              6. Betroffenenrechte
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Sie haben das Recht:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2" component="p" gutterBottom>
                  gemäß Art. 7 Abs. 3 DSGVO Ihre einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen. Dies hat zur Folge, dass wir die Datenverarbeitung, die auf dieser Einwilligung beruhte, für die Zukunft nicht mehr fortführen dürfen;
                </Typography>
              </li>
              <li>
                <Typography variant="body2" component="p" gutterBottom>
                  gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen. Insbesondere können Sie Auskunft über die Verarbeitungszwecke, die Kategorie der personenbezogenen Daten, die Kategorien von Empfängern, gegenüber denen Ihre Daten offengelegt wurden oder werden, die geplante Speicherdauer, das Bestehen eines Rechts auf Berichtigung, Löschung, Einschränkung der Verarbeitung oder Widerspruch, das Bestehen eines Beschwerderechts, die Herkunft ihrer Daten, sofern diese nicht bei uns erhoben wurden, sowie über das Bestehen einer automatisierten Entscheidungsfindung einschließlich Profiling und ggf. aussagekräftigen Informationen zu deren Einzelheiten verlangen;
                </Typography>
              </li>
              <li>
                <Typography variant="body2" component="p" gutterBottom>
                  gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen;
                </Typography>
              </li>
              <li>
                <Typography variant="body2" component="p" gutterBottom>
                  gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist;
                </Typography>
              </li>
              <li>
                <Typography variant="body2" component="p" gutterBottom>
                  gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen, soweit die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen und wir die Daten nicht mehr benötigen, Sie jedoch diese zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen oder Sie gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung eingelegt haben;
                </Typography>
              </li>
              <li>
                <Typography variant="body2" component="p" gutterBottom>
                  gemäß Art. 20 DSGVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu verlangen und
                </Typography>
              </li>
              <li>
                <Typography variant="body2" component="p" gutterBottom>
                  gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie sich hierfür an die Aufsichtsbehörde ihres üblichen Aufenthaltsortes oder Arbeitsplatzes oder unseres Vereinssitzes wenden.
                </Typography>
              </li>
            </ul>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" gutterBottom>
                        Information über Ihr Widerspruchsrecht nach Art. 21 DSGVO
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" gutterBottom>
                        Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Sie betreffender personenbezogener Daten, die aufgrund von Artikel 6 Abs. 1 S. 1 lit. e DSGVO (Datenverarbeitung im öffentlichen Interesse) und Artikel 6 Abs. 1 S. 1 lit. f DSGVO (Datenverarbeitung auf der Grundlage einer Interessenabwägung) erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmung gestütztes Profiling von Artikel 4 Nr. 4 DSGVO.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" gutterBottom>
                        Legen Sie Widerspruch ein, werden wir Ihre personenbezogenen Daten nicht mehr verarbeiten, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" gutterBottom>
                        Sofern sich Ihr Widerspruch gegen eine Verarbeitung von Daten zum Zwecke der Direktwerbung richtet, so werden wir die Verarbeitung umgehend einstellen. In diesem Fall ist die Angabe einer besonderen Situation nicht erforderlich. Dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2">
                        Möchten Sie von Ihrem Widerspruchsrecht Gebrauch machen, genügt eine E-Mail an <Link href="mailto:datenschutzkoordination@zv.fraunhofer.de">datenschutzkoordination@zv.fraunhofer.de</Link>.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </CustomCard>

        <CustomCard>
          <CardContent>
            <Typography variant="h6" component="p">
              7. Datensicherheit
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Alle von Ihnen persönlich übermittelten Daten werden mit dem allgemein üblichen und sicheren Standard TLS (Transport Layer Security) verschlüsselt übertragen. TLS ist ein sicherer und erprobter Standard, der z.B. auch beim Onlinebanking Verwendung findet. Sie erkennen eine sichere TLS-Verbindung unter anderem an dem angehängten s am http (also https://..) in der Adressleiste Ihres Browsers oder am Schloss-Symbol im unteren Bereich Ihres Browsers.
            </Typography>
            <Typography variant="body2" component="p">
              Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
            </Typography>
          </CardContent>
        </CustomCard>
        <CustomCard>
          <CardContent>
            <Typography variant="h6" component="p">
              8. Aktualität und Änderung dieser Datenschutzinformation
            </Typography>
            <Typography variant="body2" component="p" gutterBottom>
              Diese Datenschutzinformation ist aktuell gültig und hat den Stand Mai 2024.
            </Typography>
            <Typography variant="body2" component="p">
              Durch die Weiterentwicklung unserer Webseite und Angebote darüber oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzinformation zu ändern. Die jeweils aktuelle Datenschutzinformation kann jederzeit auf der Webseite unter <Link href="http://www.sustain.ki.nrw/datenschutz/">www.sustain.ki.nrw/datenschutz/</Link> von Ihnen abgerufen und ausgedruckt werden.
            </Typography>
          </CardContent>
        </CustomCard>

      </div>
    </Container>
  );
}

export default PrivacyPolicy;
