import React from 'react';
import { Typography, Link, Card, CardContent, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled blockquote
const CustomCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    textAlign: 'left',
}));

const Title = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));

const Imprint = () => {
    return (
        <Container maxWidth="md">
            <div className="MarkdownPage_markdownPage__FKTlV Impressum_impressumContainer__5z+43 container-fluid">
                <CustomCard>
                    <CardContent>
                        <Title variant="h5" component="p">
                            Impressum
                        </Title>
                    </CardContent>
                </CustomCard>

                <CustomCard>
                    <CardContent>
                        <Typography variant="subtitle2" component="p" gutterBottom>
                            Der Demonstrator »llm-insight-expert«
                        </Typography>
                        <Typography variant="body2" component="p" gutterBottom>
                            Eine Plattform des Fraunhofer-Instituts für Intelligente Analyse- und Informationssysteme IAIS, Schloss Birlinghoven 1, 53757 Sankt Augustin.
                        </Typography>
                    </CardContent>
                </CustomCard>

                <CustomCard>
                    <CardContent>
                        <Typography variant="subtitle2" component="p" gutterBottom>
                            Anbieter der Webpräsenz des Demonstrators »llm-insight-expert« Nordrhein-Westfalen
                        </Typography>
                        <Typography variant="body2" component="p" gutterBottom>
                            Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V. <br />
                            Hansastraße 27c, 80686 München
                        </Typography>
                        <Typography variant="subtitle1" component="p" gutterBottom>
                            Telefon: <Link href="tel:+498912050" aria-label="Telefonnummer">+49 89 1205 – 0</Link> <br />
                            Fax: <Link href="tel:+498912057531" aria-label="Faxnummer">+49 89 1205-7531</Link> <br />
                            <Link href="mailto:info@zv.fraunhofer.de" aria-label="Email">info@zv.fraunhofer.de</Link> <br />
                            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE 129515865
                        </Typography>
                    </CardContent>
                </CustomCard>

                <CustomCard>
                    <CardContent>
                        <Typography variant="subtitle2" component="p" gutterBottom>
                            Registergericht
                        </Typography>
                        <Typography variant="body2" component="p" gutterBottom>
                            Amtsgericht München <br />
                            Eingetragener Verein <br />
                            Register-Nr. VR 4461
                        </Typography>
                    </CardContent>
                </CustomCard>

                <CustomCard>
                    <CardContent>
                        <Typography variant="subtitle2" component="p" gutterBottom>
                            Vertreten durch den Vorstand
                        </Typography>
                        <Typography variant="body2" component="p" gutterBottom>
                            Prof. Dr.-Ing. Reimund Neugebauer, Präsident, Unternehmensstrategie, Forschung und Kommunikation <br />
                            Prof. Dr. Alexander Kurz, Innovation, Transfer und Verwertung <br />
                            Prof. Dr. Axel Müller-Groeling, Forschungsinfrastrukturen und Digitalisierung <br />
                            Ass. jur. Elisabeth Ewen, Personal, Unternehmenskultur und Recht <br />
                            Dr. Sandra Krey, Finanzen und Controlling
                        </Typography>
                    </CardContent>
                </CustomCard>

                <CustomCard>
                    <CardContent>
                        <Typography variant="subtitle2" component="p" gutterBottom>
                            Redaktionsverantwortlich für die Webpräsenz der Kompetenzplattform Künstliche Intelligenz Nordrhein-Westfalen im Sinne des Presserechts
                        </Typography>
                        <Typography variant="body2" component="p" gutterBottom>
                            Katrin Berkler, Leiterin Presse und Öffentlichkeitsarbeit <br />
                            Silke Loh, Stv. Leiterin Presse und Öffentlichkeitsarbeit <br />
                            E-Mail: <Link href="mailto:pr@iais.fraunhofer.de" aria-label="Email für Pressekontakt">pr@iais.fraunhofer.de</Link>
                        </Typography>
                    </CardContent>
                </CustomCard>
            </div>
        </Container>
    );
}

export default Imprint;
