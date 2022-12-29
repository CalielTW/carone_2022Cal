import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { baseURL } from "../../api/api";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import Carousel from "../../components/vehicles/Carousel";
import Meta from "../../components/Meta";
import Form from "../../components/autos/PromotionsForm";
import parse from "html-react-parser";

const Slug = ({ promotion }) => {
  const router = useRouter();
  const [currPromotion, setCurrPromotion] = useState("");

  const url = `https://carone.com.mx${router.asPath}`;

  const Capitalize = (string) => {
    if (string === undefined) return "";

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (promotion) setCurrPromotion(promotion);
  }, [promotion]);

  if (!currPromotion._id) return null;
  if (
    currPromotion &&
    currPromotion.vehicle &&
    !currPromotion.vehicle.isPublished
  )
    return null;

  return (
    <Container maxWidth="lg">
      <Box style={{ marginBottom: 30, marginTop: 25, textAlign: "center" }}>
        <img className="mainLogo" alt="Logo carone" />
        <Divider sx={{ marginTop: 2 }} />
      </Box>
      <Grid
        container
        spacing={4}
        display="flex"
        alignItems="top"
        justifyContent="center"
      >
        <Grid item xs={12} md={7}>
          <Carousel
            vehicle={promotion.vehicle}
            medias={[{ image: promotion.image }]}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Form vehicle={promotion.vehicle} promotion={promotion} url={url} />
        </Grid>
      </Grid>

      <Box>
        <Typography variant="caption">{parse(promotion.legales)}</Typography>
      </Box>
    </Container>
  );
};
Slug.layout = "PromotionsLayout";

export const getServerSideProps = async (ctx) => {
  // `https://apicarone.com/api/v1/promotions?slug${ctx.params.slug}`
  const res = await fetch(`${baseURL}/promotions/slug/${ctx.params.slug}`);
  const responsePromotion = await res.json();

  return {
    props: {
      promotion: responsePromotion.data,
    },
  };
};

export default Slug;
