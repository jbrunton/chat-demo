import * as pulumi from "@pulumi/pulumi";

/**
 * registerAutoTags registers a global stack transformation that merges a set
 * of tags with whatever was also explicitly added to the resource definition.
 */
export function registerAutoTags(autoTags: Record<string, string>): void {
  pulumi.runtime.registerStackTransformation((args) => {
    const props = args.props;
    if (Object.hasOwnProperty.call(props, "tags")) {
      props.tags = { ...autoTags, ...props.tags };
      return { props: props, opts: args.opts };
    }
    return undefined;
  });
}
