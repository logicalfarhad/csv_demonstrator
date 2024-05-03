import React from 'react';
import { Typography, Link, Card, CardContent, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled blockquote
const CustomBlockquote = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    textAlign: 'left',
}));


const TermsOfUse = () => {
    return (
        <Container maxWidth="md">
            <div className="MarkdownPage_markdownPage__FKTlV Nutzungsbedingungen_nutzungsbedingungenContainer__NWXYE container-fluid">
                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h4" component="h2" align="left" gutterBottom>
                            Nutzungsbedingungen für den Dienst llm-insight-expert
                        </Typography>
                        <Typography variant="h5" component="h4" align="left">
                            <em>Stand: Marz 2024</em>
                        </Typography>
                    </CardContent>
                </CustomBlockquote>

                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h3">
                            1. Inhalt und Zustandekommen
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>1.1. Parteien und Gegenstand.</strong> Dieser Vertrag regelt das rechtliche Verhältnis zwischen der Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V., Hansastraße 27c, 80686 München, für ihr rechtlich unselbstständiges Fraunhofer-Institut für Intelligente Analyse- und Informationssysteme (IAIS), Schloss Birlinghoven, 53757 Sankt Augustin ("Fraunhofer") und dem Nutzer ("Nutzer") in Bezug auf die unentgeltliche Bereitstellung einer testweisen Nutzung der Analysesoftware von Nachhaltigkeitsberichten Sustain.AI von Fraunhofer im Wege der Nutzung über das Internet als "Software as a Service" ("Dienst").
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>1.2. Zustandekommen des Vertrages.</strong> Für die Nutzung des Dienstes muss der Nutzer ein Nutzerkonto anlegen. Nach Absenden des entsprechenden Registrier-Formulars sendet Fraunhofer an die bei Registrierung angegebene E-Mail-Adresse einen individuellen Freischalte-Link. Durch Klicken des Freischalte-Links wird die Registrierung abgeschlossen und es kommt ein Vertrag zwischen Fraunhofer und dem Nutzer gemäß diesen Nutzungsbedingungen. Nutzer ist das bei Registrierung angegebene Unternehmen und falls ein solches nicht angegeben werden die sich registrierende Person selbst.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>1.3. AGB des Nutzers.</strong> Allgemeine Geschäftsbedingungen des Nutzers, die diesen Nutzungsbedingungen entgegenstehen oder von ihnen abweichen, finden keine Anwendung. Dies gilt auch dann, wenn Fraunhofer den Geschäftsbedingungen des Nutzers nicht ausdrücklich widerspricht.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>

                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h3">
                            2. llm-insight-expert Dienst
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>2.1. Gegenstand.</strong> Gegenstand. Sustain.AI ist ein Dienst zur KI-basierten Analyse von Nachhaltigkeitsberichten von Unternehmen. Nutzer können beispielhafte Daten (z.B. öffentliche Nachhaltigkeitsberichte von Unternehmen) im Dienst hochladen und nach den inhaltlichen GRI Universal Standards der Berichtserstattung analysieren lassen. Der Dienst führt auf Rechnern von Fraunhofer (bzw. einem Dienstleister von Fraunhofer) eine Analyse der Daten durch und liefert die Ergebnisse mit den erkannten Informationen zurück (»Ausgabedaten«). er Dienst basiert auf Algorithmen einschließlich Verfahren Künstlicher Intelligenz und ist insofern nicht geeignet, zu gewährleisten, dass Daten stets vollständig und/oder fehlerfrei erfasst werden.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>2.2. Nutzungszweck.</strong> Fraunhofer stellt den Dienst dem Nutzer ausschließlich für den Zweck bereit, die Qualität der Dienste durch den Algorithmus zu bewerten. Eine Nutzung für produktive Zwecke ist nicht gestattet. Dem Nutzer ist bekannt, dass Fraunhofer den Algorithmus weiterentwickeln kann und, dass sich dadurch die Ergebnisdaten-Inhalte und -Qualität ändern können. Bestimmte mittels des Dienstes erlangte Ergebnisse stellen keine Beschreibung oder Gewähr von Leistungen oder Produkten von Fraunhofer dar.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>

                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h3">
                            3. Nutzungsbefugnis und Lizenzbestimmungen
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>3.1. Nutzungsrecht.</strong> Fraunhofer stellt dem Nutzer den Dienst zur Nutzung über das Internet zur Verfügung. Der Dienst wird auf Servern eines von Fraunhofer bzw. einem technischen Dienstleister genutzten Rechenzentrums betrieben. Der Nutzer erhält für die Laufzeit dieses Vertrages unentgeltlich das nicht ausschließliche und nicht übertragbare und nicht unterlizenzierbare Recht, auf den Dienst mittels eines Browsers und einer Internetverbindung zuzugreifen und für die in Ziffer 2.2 genannten einen Zwecke, im hierfür erforderlichen Umfang zu nutzen. Die eingeräumten Nutzungsrechte umfassen keine Rechte am Quellcode und keine Rechte am Objekt-/Programmcode und keine Rechte an den Algorithmen.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>3.2. Nutzungsumfang. </strong> Der Umfang des Nutzungsrechts ist auf die im Rahmen der Registrierung angegebenen Nutzungseinheiten (z.B. Anzahl von Berichten).
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>3.3. Drittsoftware. </strong> Der lokal im Browser ausgeführten Programmcode kann Drittsoftware beinhalten, insbesondere sogenannte Free und Open Source Software (»Drittkomponenten«). Auf Drittkomponenten und finden abweichend von diesen Nutzungsbedingungen vorrangig die Nutzungs- und Lizenzbedingungen der jeweiligen Drittanbieter Anwendung. Für die Drittkomponenten können Nutzungs- und Lizenzbedingungen gelten, auf die auch ausländisches Recht Anwendung finden kann. Die Nutzungsrechte erhält der Nutzer dabei ggf. unmittelbar von dem jeweiligen Drittanbieter, wenn die Lizenzbedingungen keine Unterlizenzierung erlauben. Eine Liste der eingesetzten Drittkomponenten ist auf Anfrage erhältlich.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>
                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            4. Verfügbarkeit
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>4.1. Verfügbarkeit.</strong> Fraunhofer bemüht sich, den Dienst mit einer angemessenen Verfügbarkeit (95,0 %) im Kalendermonat während der Betriebszeit bereit zu stellen. Ein Anspruch auf eine bestimmte Verfügbarkeit hat der Nutzer jedoch nicht. Die Verfügbarkeit bezieht sich auf den Anschlusspunkt des Router-Ausgangs des von Fraunhofer genutzten Rechenzentrums. Bei der Berechnung der erreichten Verfügbarkeit bleiben Ausfälle aufgrund höherer Gewalt (z.B. Streik, Unruhen, Naturkatastrophen, Epidemien) unberücksichtigt. Ebenso unberücksichtigt bleiben Einschränkungen der Dienst durch Fraunhofer, die Fraunhofer aus Sicherheitsgründen (z.B. Denial of Service Attacke, schwere Sicherheitslücke in einer genutzten Fremd-Software ohne verfügbarem Patch) für erforderlich halten darf, sofern angemessene Vorkehrung zur Sicherheit der Plattform getroffen wurde.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>4.2. Betriebszeit.</strong> Die Betriebszeit ist werktäglich von 9-17 Uhr MEZ. Nicht zur Betriebszeit gehören von Fraunhofer per E-Mail angekündigte Wartungsarbeiten (z.B. Installation von Updates oder Upgrades) von bis zu 2 Stunden je Woche. Fraunhofer wird sich bemühen, Wartungsarbeiten auf die Zeit außerhalb der Betriebszeit zu legen. Fraunhofer wird den Nutzer über geplante Wartungsarbeiten rechtzeitig benachrichtigen.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>4.3. Störungsmeldung.</strong> Der Nutzer wird ihm bekannt gewordene Störungen des Dienstes (z.B. Unerreichbarkeit) erforderlichenfalls unverzüglich Fraunhofer mitteilen. Fraunhofer wird den Nutzer über bekannte Störungen nach Möglichkeit auf der Dienst oder ggf. per E-Mail informieren.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>

                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            5. Pflichten und Obliegenheiten des Nutzers
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>5.1. Nutzerkonten.</strong> Der Nutzer wird die Zugangsdaten zum Nutzerkonto vertraulich behandeln und nicht an andere Personen weitergeben. Soweit im Nutzerkonto ein Unternehmen angegeben ist, muss die sich registrierende Person befugt sein, diese rechtsgeschäftlich zu vertreten. Mehrere Personen dürfen sich ein Nutzungskonto nicht teilen. Im Falle des Missbrauchs eines Nutzerkontos oder eines entsprechenden Verdachts informiert der Nutzer unverzüglich Fraunhofer. Der Abruf von Inhalten vom Dienst mittels automatisierter Programme (z.B. Bots, Screen-Scraping) ist unzulässig.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>5.2. Richtigkeit von Angaben.</strong> Die Angaben im Nutzerkonto sind richtig zu hinterlegen und bei Änderung zu aktualisieren.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>5.3. Systemanforderungen.</strong> Der Browser des Nutzers muss die Ausführung von JavaScript und das Setzen von Cookies erlauben.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>5.4. Internetverbindung.</strong> Der Nutzer ist für die Herstellung der Internetverbindung zum Rechenzentrum des Dienstes verantwortlich und trägt die hierfür anfallenden Kosten.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>5.5. Rechtmäßige Nutzung.</strong> Der Nutzer wird den Dienst nur im Rahmen der vertraglichen und gesetzlichen Bestimmungen nutzen und bei der Nutzung keine Rechte Dritter (z.B. Urheberrechte, gesetzliche und vertragliche Geheimhaltungspflichten) verletzen. Der Nutzer wird bei der Nutzung insbesondere die Vorschriften zum Datenschutz, Urheberrecht, Geheimnisschutz und Wettbewerbsrecht beachten.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>5.6. Sicherungskopien.</strong> Dem Nutzer obliegt es, Kopien der Eingabe - und Ausgabedaten bei sich vorzuhalten und regelmäßig Sicherheitskopien in Form von Datenexporten anzufertigen. Verletzt das Nutzer diese ihm obliegende Pflicht zur ordnungsgemäßen Datensicherung, so haftet Fraunhofer bei Datenverlusten der Höhe nach begrenzt auf solche Schäden, die auch bei einer ordnungsgemäßen regelmäßigen Datensicherung durch das Nutzer aufgetreten wären.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>
                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            6. Kundendaten Datenschutz
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>6.1. Kundendaten.</strong> Fraunhofer wird die Eingabe- und Ausgabedaten (»Kundendaten«) zur Erbringung des Dienstes verwenden. Der Nutzer räumt hiermit Fraunhofer an den Kundendaten ein zeitlich beschränktes, weltweites, unentgeltliches Nutzungsrecht ein, die Daten für die Vertragserfüllung zu nutzen. Dieses Recht umfasst darüber hinaus auch das Recht die Kundendaten zur Verbesserung des Dienstes zu nutzen. Das Nutzungsrecht ist auf die Vertragslaufzeit sowie einen darüberhinausgehenden Zeitraum von 31 Tagen begrenzt. Fraunhofer ist berechtigt Eingabedaten zu löschen, wenn Fraunhofer begründeten Verdacht hat, dass Eingabedaten gegen Rechte Dritter oder gesetzliche Bestimmungen verstoßen.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>6.2. Datenschutzhinweise.</strong> Soweit im Rahmen der Bereitstellung des Dienstes Daten des Nutzers verarbeitet werden (z.B. Login-Daten) ist Fraunhofer Verantwortlicher. Einzelheiten zur diesbezüglichen Datenverarbeitung sind in den Datenschutzinformationen beschrieben; diese sind nicht Vertragsbestandteil.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>
                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            7. Mängelansprüche und Haftung
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>7.1. Gesetzliche Bestimmungen.</strong> Fraunhofer stellt den Dienst unentgeltlich bereit. Für die Bereitstellung des Dienst gelten die Bestimmungen über die Leihe, d. h. insbesondere, die Mängelhaftung von Fraunhofer ist gemäß § 600 BGB auf Arglist beschränkt, die Haftung gemäß § 599 BGB ist auf Vorsatz und grobe Fahrlässigkeit beschränkt und es gilt die Verjährung von sechs Monaten gemäß § 606 BGB.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>7.2. Workarounds.</strong> Die Beseitigung eines Mangels durch Fraunhofer kann auch durch Hinweise zur Beseitigung oder Umgehung der Auswirkungen des Mangels erfolgen (sog. Workaround), soweit dem Nutzer hierdurch bestehenbleibende Nutzungsbeeinträchtigungen zumutbar sind.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>
                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            8. Freistellungspflichten
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>8.1. Pflicht zur Freistellung.</strong> Machen Dritte (einschließlich öffentliche Stellen) gegenüber Fraunhofer Ansprüche bzw. Rechtsverletzungen geltend, die auf der Behauptung beruhen, dass der Nutzer gegen seine vertraglichen Pflichten verstoßen hat, insbesondere rechtswidrige Inhalte in den Dienst eingespielt oder den Dienst in sonst rechtswidriger Weise genutzt hat (z.B. Urheberrechtsverstöße oder Datenschutzverstöße bei hochgeladenen Dokumente), so gilt Folgendes: Das Nutzer wird Fraunhofer von diesen Ansprüchen unverzüglich freistellen, Fraunhofer bei der Rechtsverteidigung angemessene Unterstützung bieten und Fraunhofer von den Kosten der Rechtsverteidigung freistellen.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>8.2. Voraussetzungen der Freistellungspflicht.</strong> Voraussetzung für die Freistellungspflicht nach Ziffer 9.1. ist, dass Fraunhofer den Nutzer über geltend gemachte Ansprüche unverzüglich schriftlich informiert, keine Anerkenntnisse oder gleichkommende Erklärungen abgibt und es dem Nutzer ermöglicht, auf Kosten des Nutzers - soweit möglich - alle gerichtlichen und außergerichtlichen Verhandlungen über die Ansprüche zu führen.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>
                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            9. Laufzeit und Kündigung
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>9.1. Laufzeit.</strong> Der Vertrag wird auf unbestimmte Zeit geschlossen und kann von jeder Partei ohne Einhaltung einer Kündigungsfrist ordentlich gekündigt werden. Das Recht zur außerordentlichen Kündigung bleibt unberührt.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>9.2. Form.</strong> Die Kündigung muss in Textform (z.B. E-Mail) erfolgen.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>9.3. Daten bei Vertragsende.</strong> Mit Ende der Laufzeit kann der Nutzer nicht mehr auf seine Kundendaten zugreifen. Es obliegt dem Nutzer, Daten vor Ende der Laufzeit zu exportieren und bei sich zur weiteren Verwendung zu speichern. Mit Ende der Laufzeit ist Fraunhofer berechtigt, die Kundendaten und das Nutzungskonto zu löschen.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>
                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            10. Änderungsvorbehalte
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>10.1. Änderung der Nutzungsbedingungen.</strong> Fraunhofer hat das Recht, diese Nutzungsbedingungen abzuändern oder um Regelungen für die Nutzung etwaig neu eingeführter zusätzlicher oder geänderter Funktionen zu ergänzen. Das Änderungsrecht gilt insbesondere im Falle von Veränderung der Gesetzeslage oder höchstrichterlichen Rechtsprechung oder Änderung der (sicherheits-)technischen Rahmenbedingungen. Die Änderungen und Ergänzungen der Nutzungsbedingungen werden dem Nutzer spätestens acht Wochen vor dem geplanten Inkrafttreten per E-Mail an die von ihm angegebene E-Mail-Adresse angekündigt. Die Zustimmung des Nutzers zur Änderung der Nutzungsbedingungen gilt als erteilt, wenn das Nutzer der Änderung nicht innerhalb einer Frist von sechs Wochen, beginnend mit dem Tag, der auf die Änderungsankündigung folgt, in Textform widerspricht. Fraunhofer verpflichtet sich, in der Änderungsankündigung auf die Möglichkeit des Widerspruchs, die Frist für den Widerspruch, das Textformerfordernis sowie die Bedeutung, bzw. die Folgen des Unterlassens eines Widerspruchs gesondert hinzuweisen.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>10.2. Änderung des Dienst.</strong> Fraunhofer behält sich vor, den Dienst zu ändern oder abweichende Funktionalitäten bereitzustellen, wenn die Änderung oder Abweichung unter Berücksichtigung der Interessen von Fraunhofer und dem Nutzer angemessen ist. Ein Grund für solche Änderungen kann vorliegen, wenn die Änderung erforderlich ist aufgrund (i) einer notwendigen Anpassung an eine neue Rechtslage oder Rechtsprechung, oder zur Erfüllung von gerichtlichen oder behördlichen Entscheidungen gegenüber Fraunhofer (ii) geänderter technischer Rahmenbedingungen (neue Browser-versionen oder technische Standards), oder (iii) des Schutzes der Systemsicherheit. Daneben kann Fraunhofer die Dienst im Rahmen einer Fortentwicklung des Dienstes angemessen ändern (z.B. Abschaltung alter Funktionen, die durch neue weitgehend ersetzt wurden). Sofern mit der Bereitstellung einer geänderten Version des Dienstes oder einer Änderung von Funktionalitäten des Dienstes eine wesentliche Änderung der Arbeitsabläufe oder wesentliche Beschränkungen in der Verwendbarkeit für den Nutzer einhergehen, wird Fraunhofer dies dem Nutzer rechtzeitig, spätestens vier Wochen vor dem Wirksamwerden einer solchen Änderung in Textform ankündigen.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>
                <CustomBlockquote>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            11. Schlussbestimmungen
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>11.1 Erklärungen und Mitteilungen.</strong> Fraunhofer ist berechtigt, sämtliche Erklärungen und Mitteilungen in Bezug auf das Vertragsverhältnis zur Bereitstellung des Dienstes an die vom Nutzer bei Registrierung angegebene E-Mail-Adresse zu senden. Das Nutzer ist verpflichtet, den Posteingang dieses E-Mail-Postfachs regelmäßig zu prüfen.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>11.2. Änderungen in Textform.</strong> Änderungen dieser Nutzungsbedingungen bedürfen der Schrift- oder Textform. Dies gilt auch für die Abbedingung dieses Formerfordernisses selbst.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>11.3. Anwendbares Recht.</strong> Sofern der Nutzer Unternehmer ist, gilt: Auf diesen Vertrag und sämtliche damit im Zusammenhang stehende Streitigkeiten (sowohl vertraglich als auch deliktisch) findet ausschließlich deutsches Recht unter Ausschluss des UN-Kaufrechts Anwendung.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>11.4. Gerichtsstand.</strong> Ist das Nutzer Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen, so ist ausschließlicher Gerichtsstand derjenige bei Fraunhofer. Fraunhofer bleibt berechtigt, am Sitz des Nutzers zu klagen.
                        </Typography>
                        <br />
                        <Typography variant="body1" component="p">
                            <strong>11.5. Teilunwirksamkeit.</strong> Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird dadurch die Wirksamkeit der übrigen Bestimmungen nicht berührt.
                        </Typography>
                    </CardContent>
                </CustomBlockquote>
            </div>
        </Container>
    );
}

export default TermsOfUse;

